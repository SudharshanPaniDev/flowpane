import { useState } from "react";
import { Button, Stepper } from "flowpane";

const steps = [
  { id: "customer", label: "Customer", description: "Who is ordering" },
  { id: "items", label: "Items", description: "Products and quantities" },
  { id: "shipping", label: "Shipping", description: "Address and method" },
  { id: "review", label: "Review", description: "Confirm and submit" }
];

export default function Example() {
  const [current, setCurrent] = useState(1);
  const done = current === steps.length;

  return (
    <div style={{ display: "grid", gap: 24, width: "100%" }}>
      <Stepper steps={steps} currentStep={current} onStepClick={setCurrent} />
      <div style={{ display: "flex", gap: 8 }}>
        <Button variant="secondary" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
          Back
        </Button>
        <Button onClick={() => setCurrent((c) => Math.min(steps.length, c + 1))} disabled={done}>
          {current >= steps.length - 1 ? "Submit order" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
