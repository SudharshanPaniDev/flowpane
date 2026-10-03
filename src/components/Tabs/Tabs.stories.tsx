import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: { defaultValue: "overview", children: null },
  parameters: {
    docs: {
      description: {
        component:
          "Follows the WAI-ARIA tabs pattern: only the selected tab is in the Tab order, arrow keys move between tabs (skipping disabled ones), Home/End jump to the ends, and selection follows focus. Works controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`)."
      }
    }
  }
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Order details">
        <Tab value="overview">Overview</Tab>
        <Tab value="items">Items (3)</Tab>
        <Tab value="payments">Payments</Tab>
        <Tab value="audit" disabled>
          Audit log
        </Tab>
      </TabList>
      <TabPanel value="overview">
        Order <strong>A-102</strong> for Fabrikam · <StatusBadge tone="success">Paid</StatusBadge>
      </TabPanel>
      <TabPanel value="items">Three line items totalling $450.00.</TabPanel>
      <TabPanel value="payments">Paid by card ending 4242 on 12 Sep.</TabPanel>
      <TabPanel value="audit">Audit history is available on the Enterprise plan.</TabPanel>
    </Tabs>
  )
};
