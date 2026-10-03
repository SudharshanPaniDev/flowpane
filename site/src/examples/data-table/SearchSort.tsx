import { DataTable, type DataTableColumn } from "flowpane";

type Customer = { id: string; name: string; country: string; orders: number; lastOrder: Date };

const customers: Customer[] = [
  { id: "c1", name: "Northwind Traders", country: "Germany", orders: 42, lastOrder: new Date(2026, 8, 28) },
  { id: "c2", name: "Contoso Ltd", country: "United States", orders: 7, lastOrder: new Date(2026, 6, 2) },
  { id: "c3", name: "Fabrikam", country: "Netherlands", orders: 19, lastOrder: new Date(2026, 8, 12) },
  { id: "c4", name: "Adventure Works", country: "Canada", orders: 63, lastOrder: new Date(2026, 8, 30) },
  { id: "c5", name: "Tailspin Toys", country: "United Kingdom", orders: 3, lastOrder: new Date(2026, 2, 19) },
  { id: "c6", name: "Wide World Importers", country: "India", orders: 28, lastOrder: new Date(2026, 7, 21) },
  { id: "c7", name: "Litware Inc", country: "Sweden", orders: 11, lastOrder: new Date(2026, 8, 3) }
];

const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

const columns: DataTableColumn<Customer>[] = [
  { id: "name", header: "Customer", accessor: (row) => row.name, sortable: true },
  { id: "country", header: "Country", accessor: (row) => row.country, sortable: true },
  { id: "orders", header: "Orders", accessor: (row) => row.orders, sortable: true, searchable: false, align: "right" },
  {
    id: "lastOrder",
    header: "Last order",
    accessor: (row) => row.lastOrder,
    sortable: true,
    searchable: false,
    cell: (row) => date.format(row.lastOrder)
  }
];

export default function Example() {
  return (
    <DataTable
      data={customers}
      columns={columns}
      getRowId={(row) => row.id}
      caption="Customers"
      hideCaption
      searchable
      searchPlaceholder="Search customers or countries…"
      defaultSort={{ columnId: "orders", direction: "desc" }}
      pageSize={5}
    />
  );
}
