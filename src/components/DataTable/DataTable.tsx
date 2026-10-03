import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";
import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { EmptyState } from "../EmptyState/EmptyState";
import { TextField } from "../TextField/TextField";

export type CellValue = string | number | boolean | Date | null | undefined;

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  /** Plain value for the column, used for sorting, searching, and as the default cell content. */
  accessor?: (row: T) => CellValue;
  /** Custom cell content, e.g. a StatusBadge or formatted currency. Falls back to the accessor value. */
  cell?: (row: T) => ReactNode;
  /** Allow sorting by this column. Requires `accessor`. */
  sortable?: boolean;
  /** Include this column in search. Defaults to true when the column has an accessor. */
  searchable?: boolean;
  align?: "left" | "center" | "right";
  /** CSS width, e.g. "8rem". Also used as the minimum width so the column doesn't squash on small screens. */
  width?: string;
}

export type SortDirection = "asc" | "desc";

export interface SortState {
  columnId: string;
  direction: SortDirection;
}

export interface DataTableToolbarContext {
  selectedIds: string[];
  clearSelection: () => void;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** Stable unique id for each row; used for keys and selection. */
  getRowId: (row: T) => string;
  /** Describes the table for screen readers (and visually, unless `hideCaption`). */
  caption: string;
  hideCaption?: boolean;

  /** Show a search box that filters rows across searchable columns. */
  searchable?: boolean;
  searchLabel?: string;
  searchPlaceholder?: string;

  /** Show a checkbox per row plus a "select all on this page" checkbox. */
  selectable?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Accessible name for a row's checkbox. Defaults to "Select row <id>". */
  getRowLabel?: (row: T) => string;

  sort?: SortState | null;
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;

  /** Rows per page. Set to 0 to disable pagination. Default 10. */
  pageSize?: number;

  /** Extra controls next to the search box (filters, bulk actions). Receives the current selection. */
  toolbar?: (context: DataTableToolbarContext) => ReactNode;
  /** Shown when `data` is empty. */
  emptyState?: ReactNode;
  className?: string;
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function compareValues(a: CellValue, b: CellValue): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1; // empty values always sink to the bottom
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  return collator.compare(String(a), String(b));
}

function toText(value: CellValue): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}

function headerText(header: ReactNode, fallback: string): string {
  return typeof header === "string" || typeof header === "number" ? String(header) : fallback;
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  caption,
  hideCaption = false,
  searchable = false,
  searchLabel = "Search",
  searchPlaceholder = "Search…",
  selectable = false,
  selectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  getRowLabel,
  sort,
  defaultSort = null,
  onSortChange,
  pageSize = 10,
  toolbar,
  emptyState,
  className
}: DataTableProps<T>) {
  const statusId = useId();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [selection, setSelection] = useControllableState({
    value: selectedIds,
    defaultValue: defaultSelectedIds,
    onChange: onSelectionChange
  });
  const [sortState, setSortState] = useControllableState<SortState | null>({
    value: sort,
    defaultValue: defaultSort,
    onChange: onSortChange
  });

  const selectedSet = useMemo(() => new Set(selection), [selection]);

  const filterRows = (value: string) => {
    const needle = value.trim().toLowerCase();
    if (!needle) return data;
    const searchColumns = columns.filter((column) => column.accessor && column.searchable !== false);
    return data.filter((row) =>
      searchColumns.some((column) => toText(column.accessor!(row)).toLowerCase().includes(needle))
    );
  };

  const filtered = useMemo(() => filterRows(query), [data, columns, query]);

  const sorted = useMemo(() => {
    if (!sortState) return filtered;
    const column = columns.find((c) => c.id === sortState.columnId);
    if (!column?.accessor) return filtered;
    const factor = sortState.direction === "asc" ? 1 : -1;
    // Copy before sorting; Array.prototype.sort is stable, so ties keep their original order.
    return [...filtered].sort((a, b) => factor * compareValues(column.accessor!(a), column.accessor!(b)));
  }, [filtered, columns, sortState]);

  const paginate = pageSize > 0;
  const pageCount = paginate ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = paginate ? sorted.slice(safePage * pageSize, safePage * pageSize + pageSize) : sorted;

  // Keep the page in range when filtering shrinks the result set.
  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const pageIds = pageRows.map(getRowId);
  const selectedOnPage = pageIds.filter((id) => selectedSet.has(id)).length;
  const allOnPageSelected = pageIds.length > 0 && selectedOnPage === pageIds.length;

  const toggleRow = (id: string) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelection([...next]);
  };

  const togglePage = () => {
    const next = new Set(selectedSet);
    if (allOnPageSelected) pageIds.forEach((id) => next.delete(id));
    else pageIds.forEach((id) => next.add(id));
    setSelection([...next]);
  };

  const clearSelection = () => setSelection([]);

  const cycleSort = (column: DataTableColumn<T>) => {
    const name = headerText(column.header, column.id);
    let next: SortState | null;
    if (sortState?.columnId !== column.id) next = { columnId: column.id, direction: "asc" };
    else if (sortState.direction === "asc") next = { columnId: column.id, direction: "desc" };
    else next = null;
    setSortState(next);
    setAnnouncement(
      next ? `Sorted by ${name}, ${next.direction === "asc" ? "ascending" : "descending"}` : "Sorting removed"
    );
  };

  const onSearch = (value: string) => {
    setQuery(value);
    setPage(0);
    const count = filterRows(value).length;
    setAnnouncement(`${count} ${count === 1 ? "result" : "results"}`);
  };

  const columnCount = columns.length + (selectable ? 1 : 0);
  const rangeStart = sorted.length === 0 ? 0 : safePage * pageSize + 1;
  const rangeEnd = paginate ? Math.min(sorted.length, (safePage + 1) * pageSize) : sorted.length;
  const toolbarContent = toolbar?.({ selectedIds: selection, clearSelection });
  const showToolbar = searchable || toolbarContent || (selectable && selection.length > 0);

  const renderEmpty = () => {
    if (data.length === 0) {
      return emptyState ?? <EmptyState title="Nothing here yet" description="Rows will appear here once they're added." />;
    }
    return (
      <EmptyState
        title="No matching results"
        description={`Nothing matches “${query}”. Try a different search.`}
        action={
          <Button variant="secondary" size="sm" onClick={() => onSearch("")}>
            Clear search
          </Button>
        }
      />
    );
  };

  return (
    <div className={cx("fp-table-wrapper", className)}>
      {showToolbar && (
        <div className="fp-table-toolbar">
          {searchable && (
            <TextField
              type="search"
              label={<span className="fp-visually-hidden">{searchLabel}</span>}
              placeholder={searchPlaceholder}
              value={query}
              onChange={(event) => onSearch(event.target.value)}
              wrapperClassName="fp-table-toolbar__search"
            />
          )}
          <div className="fp-table-toolbar__actions">
            {selectable && selection.length > 0 && (
              <span>
                {selection.length} selected{" "}
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </span>
            )}
            {toolbarContent}
          </div>
        </div>
      )}

      <div className="fp-table-scroll">
        <table className="fp-table" aria-describedby={statusId}>
          <caption className={hideCaption ? "fp-visually-hidden" : undefined}>{caption}</caption>
          <thead>
            <tr>
              {selectable && (
                <th scope="col" className="fp-table__select">
                  <Checkbox
                    aria-label="Select all rows on this page"
                    checked={allOnPageSelected}
                    indeterminate={selectedOnPage > 0 && !allOnPageSelected}
                    disabled={pageIds.length === 0}
                    onChange={togglePage}
                  />
                </th>
              )}
              {columns.map((column) => {
                const direction = sortState?.columnId === column.id ? sortState.direction : undefined;
                return (
                  <th
                    key={column.id}
                    scope="col"
                    data-align={column.align}
                    style={column.width ? { width: column.width, minWidth: column.width } : undefined}
                    aria-sort={direction ? (direction === "asc" ? "ascending" : "descending") : undefined}
                  >
                    {column.sortable && column.accessor ? (
                      <button
                        type="button"
                        className="fp-table__sort"
                        data-direction={direction}
                        onClick={() => cycleSort(column)}
                      >
                        {column.header}
                        <span className="fp-table__sort-icon" aria-hidden="true">
                          <span style={{ opacity: direction === "desc" ? 0.35 : 1 }}>▲</span>
                          <span style={{ opacity: direction === "asc" ? 0.35 : 1 }}>▼</span>
                        </span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="fp-table__empty">
                  {renderEmpty()}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const id = getRowId(row);
                const isSelected = selectedSet.has(id);
                return (
                  <tr key={id} data-selected={isSelected || undefined}>
                    {selectable && (
                      <td className="fp-table__select">
                        <Checkbox
                          aria-label={getRowLabel ? getRowLabel(row) : `Select row ${id}`}
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.id} data-align={column.align}>
                        {column.cell ? column.cell(row) : toText(column.accessor?.(row))}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="fp-table-footer">
        <span id={statusId}>
          {sorted.length === 0
            ? "No rows"
            : `Showing ${rangeStart}–${rangeEnd} of ${sorted.length} ${sorted.length === 1 ? "row" : "rows"}`}
        </span>
        {paginate && pageCount > 1 && (
          <nav className="fp-table-footer__pager" aria-label="Pagination">
            <Button variant="secondary" size="sm" onClick={() => setPage(safePage - 1)} disabled={safePage === 0}>
              Previous
            </Button>
            <span aria-live="polite">
              Page {safePage + 1} of {pageCount}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(safePage + 1)}
              disabled={safePage >= pageCount - 1}
            >
              Next
            </Button>
          </nav>
        )}
      </div>

      <div className="fp-visually-hidden" role="status" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
}
