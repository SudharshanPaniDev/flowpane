import { DataTable, StatusBadge, type DataTableColumn } from "flowpane";

type Invoice = { id: string; customer: string; status: "Paid" | "Due" | "Overdue"; amount: number };

const invoices: Invoice[] = [
  { id: "INV-2041", customer: "Northwind Traders", status: "Paid", amount: 1240 },
  { id: "INV-2042", customer: "Contoso Ltd", status: "Due", amount: 380.5 },
  { id: "INV-2043", customer: "Fabrikam", status: "Overdue", amount: 2975 },
  { id: "INV-2044", customer: "Adventure Works", status: "Paid", amount: 610 }
];

const tone = { Paid: "success", Due: "warning", Overdue: "danger" } as const;
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const columns: DataTableColumn<Invoice>[] = [
  { id: "id", header: "Invoice", accessor: (row) => row.id, width: "8rem" },
  { id: "customer", header: "Customer", accessor: (row) => row.customer },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    cell: (row) => <StatusBadge tone={tone[row.status]}>{row.status}</StatusBadge>
  },
  { id: "amount", header: "Amount", accessor: (row) => row.amount, align: "right", cell: (row) => usd.format(row.amount) }
];

export default function Example() {
  return <DataTable data={invoices} columns={columns} getRowId={(row) => row.id} caption="Invoices" hideCaption />;
}
