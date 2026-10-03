import { CodeBlock } from "../../ui/CodeBlock";

export function Installation() {
  return (
    <>
      <p className="docs-eyebrow">Getting started</p>
      <h1>Installation</h1>
      <p className="docs-lead">Add Flowpane to any React 18.2+ or React 19 project in three steps.</p>

      <h2 className="docs-h2">1. Install the package</h2>
      <CodeBlock code="npm install flowpane" title="Terminal" plain />

      <h2 className="docs-h2">2. Import the stylesheet once</h2>
      <p>
        At your app's entry point, e.g. <code>main.tsx</code>, or <code>app/layout.tsx</code> in Next.js.
      </p>
      <CodeBlock code={`import "flowpane/styles.css";`} title="main.tsx" />

      <h2 className="docs-h2">3. Use the components</h2>
      <CodeBlock
        title="Orders.tsx"
        code={`import { DataTable, StatusBadge, type DataTableColumn } from "flowpane";

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
  return <DataTable data={orders} columns={columns} getRowId={(o) => o.id} caption="Orders" searchable selectable />;
}`}
      />

      <h2 className="docs-h2">Toasts</h2>
      <p>
        Wrap your app in <code>ToastProvider</code> once, then call <code>toast()</code> anywhere.
      </p>
      <CodeBlock
        title="App.tsx"
        code={`import { Button, ToastProvider, useToast } from "flowpane";

export function App() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}

function SaveButton() {
  const { toast } = useToast();
  return <Button onClick={() => toast({ title: "Saved", tone: "success" })}>Save</Button>;
}`}
      />

      <h2 className="docs-h2">Next.js</h2>
      <p>
        Every component ships with a <code>"use client"</code> directive, so you can import them directly in App Router
        server components.
      </p>
    </>
  );
}
