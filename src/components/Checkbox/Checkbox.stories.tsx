import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: { label: "Notify customer by email" },
  parameters: {
    docs: {
      description: {
        component:
          "Native checkbox with custom styling. Supports `indeterminate` for \"select all\" controls (exposed to screen readers as `aria-checked=\"mixed\"`). Without a visible label, pass `aria-label`."
      }
    }
  }
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { label: "Select all orders", indeterminate: true } };
export const WithDescription: Story = { args: { description: "We'll send a receipt and tracking link." } };
export const Disabled: Story = { args: { disabled: true } };
