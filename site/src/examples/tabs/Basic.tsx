import { StatusBadge, Tab, TabList, TabPanel, Tabs } from "flowpane";

export default function Example() {
  return (
    <Tabs defaultValue="overview" className="example-full">
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
  );
}
