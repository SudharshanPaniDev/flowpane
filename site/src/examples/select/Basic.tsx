import { Select } from "flowpane";

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 380 }}>
      <Select
        label="Order status"
        placeholder="Choose a status…"
        description="Customers are emailed when the status changes."
        options={[
          { value: "pending", label: "Pending" },
          { value: "paid", label: "Paid" },
          { value: "shipped", label: "Shipped" },
          { value: "refunded", label: "Refunded", disabled: true }
        ]}
      />
    </div>
  );
}
