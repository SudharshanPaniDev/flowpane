import { useState } from "react";
import { Button, DataTable, StatusBadge, useToast, type DataTableColumn } from "flowpane";

type Order = { id: string; customer: string; status: "Pending" | "Shipped" };

const initialOrders: Order[] = [
  { id: "A-1040", customer: "Northwind Traders", status: "Pending" },
  { id: "A-1041", customer: "Contoso Ltd", status: "Pending" },
  { id: "A-1042", customer: "Fabrikam", status: "Shipped" },
  { id: "A-1043", customer: "Adventure Works", status: "Pending" },
  { id: "A-1044", customer: "Tailspin Toys", status: "Pending" }
];

const columns: DataTableColumn<Order>[] = [
  { id: "id", header: "Order", accessor: (row) => row.id, sortable: true, width: "7rem" },
  { id: "customer", header: "Customer", accessor: (row) => row.customer, sortable: true },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    sortable: true,
    cell: (row) => <StatusBadge tone={row.status === "Shipped" ? "info" : "warning"}>{row.status}</StatusBadge>
  }
];

export default function Example() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [selected, setSelected] = useState<string[]>([]);

  const markShipped = () => {
    setOrders((current) => current.map((o) => (selected.includes(o.id) ? { ...o, status: "Shipped" } : o)));
    toast({ title: `${selected.length} orders marked as shipped`, tone: "success" });
    setSelected([]);
  };

  return (
    <DataTable
      data={orders}
      columns={columns}
      getRowId={(row) => row.id}
      caption="Orders"
      hideCaption
      selectable
      selectedIds={selected}
      onSelectionChange={setSelected}
      getRowLabel={(row) => `Select order ${row.id}`}
      toolbar={({ selectedIds }) =>
        selectedIds.length > 0 && (
          <Button size="sm" onClick={markShipped}>
            Mark {selectedIds.length} as shipped
          </Button>
        )
      }
    />
  );
}
