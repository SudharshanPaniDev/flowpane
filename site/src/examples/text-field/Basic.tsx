import { TextField } from "flowpane";

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 380 }}>
      <TextField label="Company name" placeholder="Northwind Traders" />
      <TextField
        label="Billing email"
        type="email"
        required
        description="Invoices and receipts are sent here."
        placeholder="billing@company.com"
      />
    </div>
  );
}
