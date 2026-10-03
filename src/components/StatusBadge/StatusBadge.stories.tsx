import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "./StatusBadge";

const meta = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  args: { children: "Paid", tone: "success" },
  parameters: {
    docs: {
      description: {
        component:
          "Compact status label for tables and headers. Colour reinforces the meaning but never carries it alone: the text always states the status."
      }
    }
  }
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <StatusBadge tone="neutral">Draft</StatusBadge>
      <StatusBadge tone="info">In review</StatusBadge>
      <StatusBadge tone="success">Paid</StatusBadge>
      <StatusBadge tone="warning">Pending</StatusBadge>
      <StatusBadge tone="danger">Failed</StatusBadge>
    </div>
  )
};

export const WithoutDot: Story = { args: { dot: false, children: "Archived", tone: "neutral" } };
