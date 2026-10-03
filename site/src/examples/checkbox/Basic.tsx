import { Checkbox } from "flowpane";

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Checkbox label="Notify customer by email" defaultChecked />
      <Checkbox label="Include packing slip" description="Printed with the shipping label." />
      <Checkbox label="Mark as gift" disabled />
    </div>
  );
}
