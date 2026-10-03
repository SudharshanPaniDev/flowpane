import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";

const meta = {
  title: "Components/TextField",
  component: TextField,
  args: { label: "Customer email", placeholder: "name@company.com" },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          "Text input with a required visible label. `description` and `error` are linked with `aria-describedby`, so screen readers read them with the field; `error` also sets `aria-invalid`. All native input props pass through."
      }
    }
  }
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: "Invoices and receipts are sent here." } };
export const Required: Story = { args: { required: true } };
export const WithError: Story = { args: { defaultValue: "name@company", error: "Enter a full email address, like name@company.com" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "ops@northwind.com" } };
