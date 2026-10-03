# Flowpane

**Accessible React components for workflow-heavy business apps:** admin panels, internal tools, and operations dashboards.

General-purpose libraries give you buttons and dialogs, then leave you to build the hard parts of a back-office screen yourself. Flowpane ships both: the everyday primitives, plus the workflow components you end up rebuilding on every project.

- **DataTable** with sorting, search, row selection, pagination, and bulk actions
- **Stepper** for multi-step flows, **StatusBadge**, **EmptyState**
- **Button**, **TextField**, **Select**, **Checkbox**, **Dialog**, **Tabs**, **Toast**

Every component is keyboard accessible, screen-reader friendly, themeable with CSS variables, and covered by tests that include automated axe-core accessibility checks.

📖 **Docs:** live examples with copyable code, props tables, a theming playground, and keyboard and accessibility notes for every component. Run `npm run dev` locally, or see the deployed docs site (link coming soon). Storybook is published alongside it at `/storybook`.

## Install

```bash
npm install flowpane
```

Requires React 18.2+ or 19.

```tsx
// Once, at your app's entry point
import "flowpane/styles.css";
```

## Usage

```tsx
import { Button, DataTable, StatusBadge, type DataTableColumn } from "flowpane";

type Order = { id: string; customer: string; status: "Paid" | "Pending"; total: number };

const columns: DataTableColumn<Order>[] = [
  { id: "id", header: "Order", accessor: (o) => o.id, sortable: true },
  { id: "customer", header: "Customer", accessor: (o) => o.customer, sortable: true },
  {
    id: "status",
    header: "Status",
    accessor: (o) => o.status,
    cell: (o) => <StatusBadge tone={o.status === "Paid" ? "success" : "warning"}>{o.status}</StatusBadge>
  },
  { id: "total", header: "Total", accessor: (o) => o.total, sortable: true, align: "right" }
];

export function Orders({ orders }: { orders: Order[] }) {
  return (
    <DataTable
      data={orders}
      columns={columns}
      getRowId={(o) => o.id}
      caption="Recent orders"
      searchable
      selectable
      toolbar={({ selectedIds }) => selectedIds.length > 0 && <Button size="sm">Export {selectedIds.length}</Button>}
    />
  );
}
```

For toasts, wrap your app in `<ToastProvider>` and call `toast()` from `useToast()`.

## Components

| Component | Highlights |
| --- | --- |
| `DataTable` | Typed columns (`DataTable<Order>`), natural sorting with `aria-sort`, search across columns, select rows or a whole page (with an indeterminate header checkbox), pagination, toolbar slot that receives the selection, empty and no-results states, live-region announcements |
| `Stepper` | Ordered list with `aria-current="step"`, announces "step 2 of 4, Current step", optional jump-back to completed steps, horizontal or vertical |
| `Dialog` | Portal, focus trap, Escape to close, focus restored to the trigger, scroll lock, `alertdialog` role for destructive confirmations |
| `Tabs` | WAI-ARIA tabs: roving tabindex, arrow keys, Home/End, skips disabled tabs, controlled or uncontrolled |
| `Toast` | Labelled notifications region, `status` vs `alert` by tone, auto-dismiss that pauses on hover and focus, actions like Undo |
| `TextField`, `Select` | Visible labels, descriptions and errors linked with `aria-describedby`, `aria-invalid` on error |
| `Checkbox` | Native input, indeterminate state exposed as `aria-checked="mixed"` |
| `Button` | Variants, sizes, icons, and a `loading` state that stays focusable and readable |
| `StatusBadge`, `EmptyState` | Consistent status labels; empty views with a clear next step |

## Theming

Override any `--fp-*` variable after importing the stylesheet:

```css
:root {
  --fp-color-accent: #7c3aed;
  --fp-color-accent-hover: #6d28d9;
  --fp-radius-md: 6px;
}
```

Dark mode follows the OS by default; set `data-fp-theme="dark"` or `"light"` on `<html>` to control it. All default colour pairs meet WCAG AA contrast in both themes.

## Accessibility

- Follows the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) patterns for dialogs, tabs, and tables.
- Native elements first (`<button>`, `<input>`, `<select>`, `<table>`), so browsers and assistive tech do the heavy lifting.
- Every component has unit tests for keyboard behaviour and an axe-core check, and every Storybook story is audited in a real browser, in both themes, including colour contrast.

## Development

```bash
npm install
npm run dev          # docs site at http://localhost:5180
npm run storybook    # component workbench at http://localhost:6006
npm test             # Vitest + Testing Library + axe-core
npm run typecheck
npm run build        # ESM + CJS + type declarations + styles.css into dist/
npm run build:docs   # docs site + Storybook into site-dist/ (what Vercel deploys)
npm run check        # typecheck, tests, and package build
```

## Roadmap

Combobox, DatePicker, Popover/Menu, column filters and column visibility for DataTable, and visual regression tests.

## License

MIT © Sudharshan Pani
