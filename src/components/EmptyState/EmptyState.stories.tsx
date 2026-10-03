import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { EmptyState } from "./EmptyState";

const InboxIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  args: {
    icon: <InboxIcon />,
    title: "No orders yet",
    description: "Orders appear here as soon as customers check out. You can also create one manually.",
    action: <Button>Create order</Button>
  },
  parameters: {
    docs: {
      description: {
        component:
          "Explains why a view is empty and offers the next step. Set `headingLevel` so the title fits the page's heading outline."
      }
    }
  }
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoResults: Story = {
  args: {
    title: "No matching orders",
    description: "Try a different search or clear your filters.",
    action: <Button variant="secondary">Clear filters</Button>
  }
};
