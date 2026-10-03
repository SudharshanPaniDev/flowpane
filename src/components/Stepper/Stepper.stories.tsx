import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../Button/Button";
import { Stepper } from "./Stepper";

const steps = [
  { id: "customer", label: "Customer", description: "Who is ordering" },
  { id: "items", label: "Items", description: "Products and quantities" },
  { id: "shipping", label: "Shipping", description: "Address and method" },
  { id: "review", label: "Review", description: "Confirm and submit" }
];

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  args: { steps, currentStep: 1 },
  parameters: {
    docs: {
      description: {
        component:
          "Shows progress through a multi-step workflow as an ordered list. The current step has `aria-current=\"step\"`, and each step announces its position and status (e.g. \"Items, step 2 of 4, Current step\"). Pass `onStepClick` to let users jump back to completed steps; upcoming steps are never clickable."
      }
    }
  }
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = { args: { orientation: "vertical", currentStep: 2 } };

export const Interactive: Story = {
  render: () => {
    const [current, setCurrent] = useState(0);
    return (
      <div style={{ display: "grid", gap: 24 }}>
        <Stepper steps={steps} currentStep={current} onStepClick={setCurrent} />
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
            Back
          </Button>
          <Button onClick={() => setCurrent((c) => Math.min(steps.length, c + 1))} disabled={current === steps.length}>
            {current >= steps.length - 1 ? "Submit order" : "Continue"}
          </Button>
        </div>
      </div>
    );
  }
};
