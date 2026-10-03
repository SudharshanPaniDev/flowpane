import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const meta = {
  title: "Components/Select",
  component: Select,
  args: {
    label: "Order status",
    placeholder: "Choose a status…",
    options: [
      { value: "pending", label: "Pending" },
      { value: "paid", label: "Paid" },
      { value: "shipped", label: "Shipped" },
      { value: "refunded", label: "Refunded", disabled: true }
    ]
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          "A styled native `<select>`. For short option lists a native select is the most robust choice: correct keyboard behaviour, screen reader support, and the platform picker on mobile, with no extra JavaScript."
      }
    }
  }
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: "Customers are emailed when the status changes." } };
export const WithError: Story = { args: { required: true, error: "Choose a status to continue" } };
