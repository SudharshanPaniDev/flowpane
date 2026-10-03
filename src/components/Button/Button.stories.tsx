import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Save changes", onClick: fn() },
  parameters: {
    docs: {
      description: {
        component:
          "Triggers an action. Use one `primary` button per view for the main action, `secondary` for alternatives, `ghost` for low-emphasis actions in toolbars, and `danger` for destructive actions. `loading` keeps the button focusable and its label readable while blocking repeat clicks."
      }
    }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Delete</Button>
    </div>
  )
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  )
};

export const WithIcon: Story = { args: { iconStart: <PlusIcon />, children: "New order" } };

export const Loading: Story = { args: { loading: true, children: "Saving…" } };

export const Disabled: Story = { args: { disabled: true } };
