import { StatusBadge } from "../components/StatusBadge/StatusBadge";
import type { DataTableColumn } from "../components/DataTable/DataTable";
import { currency, shortDate, statusTone, type Order } from "./sampleData";

// Column definitions shared by the DataTable stories and the Orders example.
export const orderColumns: DataTableColumn<Order>[] = [
  { id: "id", header: "Order", accessor: (o) => o.id, sortable: true, width: "7rem" },
  {
    id: "customer",
    header: "Customer",
    // Name first so sorting orders by name; the email is included so search matches it too.
    accessor: (o) => `${o.customer} ${o.email}`,
    sortable: true,
    cell: (o) => (
      <div>
        <div style={{ fontWeight: 600 }}>{o.customer}</div>
        <div style={{ color: "var(--fp-color-text-muted)", fontSize: "0.75rem" }}>{o.email}</div>
      </div>
    )
  },
  {
    id: "status",
    header: "Status",
    accessor: (o) => o.status,
    sortable: true,
    cell: (o) => <StatusBadge tone={statusTone[o.status]}>{o.status}</StatusBadge>
  },
  {
    id: "placedAt",
    header: "Placed",
    accessor: (o) => o.placedAt,
    sortable: true,
    searchable: false,
    cell: (o) => shortDate.format(o.placedAt)
  },
  {
    id: "total",
    header: "Total",
    accessor: (o) => o.total,
    sortable: true,
    searchable: false,
    align: "right",
    cell: (o) => currency.format(o.total)
  }
];
