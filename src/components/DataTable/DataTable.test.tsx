import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expectNoA11yViolations } from "../../test/axe";
import { DataTable, type DataTableColumn } from "./DataTable";

interface Order {
  id: string;
  customer: string;
  total: number;
  status: string;
}

const orders: Order[] = [
  { id: "A-100", customer: "Northwind", total: 1200, status: "Paid" },
  { id: "A-101", customer: "Contoso", total: 90, status: "Pending" },
  { id: "A-102", customer: "Fabrikam", total: 450, status: "Paid" },
  { id: "A-103", customer: "Adventure Works", total: 3000, status: "Refunded" },
  { id: "A-104", customer: "Blue Yonder", total: 15, status: "Pending" }
];

const columns: DataTableColumn<Order>[] = [
  { id: "id", header: "Order", accessor: (o) => o.id, sortable: true },
  { id: "customer", header: "Customer", accessor: (o) => o.customer, sortable: true },
  { id: "total", header: "Total", accessor: (o) => o.total, sortable: true, align: "right" },
  { id: "status", header: "Status", accessor: (o) => o.status }
];

const bodyRows = () => within(screen.getAllByRole("rowgroup")[1]!).getAllByRole("row");
const firstColumn = () => bodyRows().map((row) => within(row).getAllByRole("cell")[0]!.textContent);

describe("DataTable", () => {
  it("renders a captioned table with column headers", () => {
    render(<DataTable data={orders} columns={columns} getRowId={(o) => o.id} caption="Recent orders" />);
    expect(screen.getByRole("table", { name: "Recent orders" })).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    expect(bodyRows()).toHaveLength(5);
  });

  it("sorts ascending, descending, then clears, updating aria-sort", async () => {
    const user = userEvent.setup();
    render(<DataTable data={orders} columns={columns} getRowId={(o) => o.id} caption="Orders" />);
    const totalHeader = screen.getByRole("columnheader", { name: /Total/ });
    const sortButton = within(totalHeader).getByRole("button");

    await user.click(sortButton);
    expect(totalHeader).toHaveAttribute("aria-sort", "ascending");
    expect(firstColumn()).toEqual(["A-104", "A-101", "A-102", "A-100", "A-103"]);

    await user.click(sortButton);
    expect(totalHeader).toHaveAttribute("aria-sort", "descending");
    expect(firstColumn()[0]).toBe("A-103");

    await user.click(sortButton);
    expect(totalHeader).not.toHaveAttribute("aria-sort");
    expect(firstColumn()).toEqual(orders.map((o) => o.id));
    expect(screen.getByRole("status")).toHaveTextContent("Sorting removed");
  });

  it("sorts text naturally (A-2 before A-10)", async () => {
    const user = userEvent.setup();
    const data = [{ id: "A-10" }, { id: "A-2" }, { id: "A-1" }];
    render(
      <DataTable
        data={data}
        columns={[{ id: "id", header: "Id", accessor: (r) => r.id, sortable: true }]}
        getRowId={(r) => r.id}
        caption="Ids"
      />
    );
    await user.click(screen.getByRole("button", { name: /Id/ }));
    expect(firstColumn()).toEqual(["A-1", "A-2", "A-10"]);
  });

  it("filters rows with search, announces the count, and offers to clear", async () => {
    const user = userEvent.setup();
    render(<DataTable data={orders} columns={columns} getRowId={(o) => o.id} caption="Orders" searchable />);
    const search = screen.getByRole("searchbox", { name: "Search" });

    await user.type(search, "paid");
    expect(firstColumn()).toEqual(["A-100", "A-102"]);
    expect(screen.getByRole("status")).toHaveTextContent("2 results");

    await user.clear(search);
    await user.type(search, "zzz");
    expect(screen.getByRole("heading", { name: "No matching results" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(bodyRows()).toHaveLength(5);
  });

  it("selects rows and the whole page, with an indeterminate header checkbox", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        data={orders}
        columns={columns}
        getRowId={(o) => o.id}
        caption="Orders"
        selectable
        getRowLabel={(o) => `Select order ${o.id}`}
        onSelectionChange={onSelectionChange}
      />
    );
    const selectAll = screen.getByRole("checkbox", { name: "Select all rows on this page" }) as HTMLInputElement;

    await user.click(screen.getByRole("checkbox", { name: "Select order A-101" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["A-101"]);
    expect(selectAll.indeterminate).toBe(true);
    expect(screen.getByText(/1 selected/)).toBeInTheDocument();

    await user.click(selectAll);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["A-101", "A-100", "A-102", "A-103", "A-104"]);
    expect(selectAll).toBeChecked();

    await user.click(selectAll);
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  it("passes the selection to the toolbar for bulk actions", async () => {
    const user = userEvent.setup();
    function Example() {
      const [selected, setSelected] = useState<string[]>([]);
      return (
        <DataTable
          data={orders}
          columns={columns}
          getRowId={(o) => o.id}
          caption="Orders"
          selectable
          selectedIds={selected}
          onSelectionChange={setSelected}
          toolbar={({ selectedIds, clearSelection }) =>
            selectedIds.length > 0 && (
              <button type="button" onClick={clearSelection}>
                Archive {selectedIds.length}
              </button>
            )
          }
        />
      );
    }
    render(<Example />);
    await user.click(screen.getByRole("checkbox", { name: "Select row A-100" }));
    await user.click(screen.getByRole("checkbox", { name: "Select row A-102" }));
    await user.click(screen.getByRole("button", { name: "Archive 2" }));
    expect(screen.queryByRole("button", { name: /Archive/ })).not.toBeInTheDocument();
  });

  it("paginates and reports the visible range", async () => {
    const user = userEvent.setup();
    render(<DataTable data={orders} columns={columns} getRowId={(o) => o.id} caption="Orders" pageSize={2} />);
    expect(screen.getByText("Showing 1–2 of 5 rows")).toBeInTheDocument();
    const pager = screen.getByRole("navigation", { name: "Pagination" });
    expect(within(pager).getByRole("button", { name: "Previous" })).toBeDisabled();

    await user.click(within(pager).getByRole("button", { name: "Next" }));
    expect(screen.getByText("Showing 3–4 of 5 rows")).toBeInTheDocument();
    expect(firstColumn()).toEqual(["A-102", "A-103"]);

    await user.click(within(pager).getByRole("button", { name: "Next" }));
    expect(firstColumn()).toEqual(["A-104"]);
    expect(within(pager).getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("returns to a valid page when search shrinks the results", async () => {
    const user = userEvent.setup();
    render(<DataTable data={orders} columns={columns} getRowId={(o) => o.id} caption="Orders" pageSize={2} searchable />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.type(screen.getByRole("searchbox"), "Northwind");
    expect(firstColumn()).toEqual(["A-100"]);
  });

  it("shows a custom empty state when there is no data", () => {
    render(
      <DataTable
        data={[] as Order[]}
        columns={columns}
        getRowId={(o) => o.id}
        caption="Orders"
        emptyState={<p>No orders yet</p>}
      />
    );
    expect(screen.getByText("No orders yet")).toBeInTheDocument();
  });

  it("renders custom cells", () => {
    render(
      <DataTable
        data={orders.slice(0, 1)}
        columns={[...columns, { id: "fmt", header: "Formatted", cell: (o) => <strong>${o.total}</strong> }]}
        getRowId={(o) => o.id}
        caption="Orders"
      />
    );
    expect(screen.getByText("$1200").tagName).toBe("STRONG");
  });

  it("has no accessibility violations with every feature on", async () => {
    const { container } = render(
      <DataTable
        data={orders}
        columns={columns}
        getRowId={(o) => o.id}
        caption="Orders"
        searchable
        selectable
        pageSize={2}
        defaultSort={{ columnId: "total", direction: "desc" }}
      />
    );
    await expectNoA11yViolations(container);
  });
});
