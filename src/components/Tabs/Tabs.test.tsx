import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

function Example({ onValueChange }: { onValueChange?: (value: string) => void }) {
  return (
    <Tabs defaultValue="overview" onValueChange={onValueChange}>
      <TabList aria-label="Order details">
        <Tab value="overview">Overview</Tab>
        <Tab value="items">Items</Tab>
        <Tab value="audit" disabled>
          Audit log
        </Tab>
        <Tab value="notes">Notes</Tab>
      </TabList>
      <TabPanel value="overview">Overview content</TabPanel>
      <TabPanel value="items">Items content</TabPanel>
      <TabPanel value="audit">Audit content</TabPanel>
      <TabPanel value="notes">Notes content</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("wires tabs to panels with ARIA", () => {
    render(<Example />);
    const tab = screen.getByRole("tab", { name: "Overview" });
    expect(tab).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel", { name: "Overview" });
    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveTextContent("Overview content");
  });

  it("uses a roving tabindex so only the selected tab is tabbable", () => {
    render(<Example />);
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Items" })).toHaveAttribute("tabindex", "-1");
  });

  it("moves with arrow keys, skips disabled tabs, and wraps", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await user.click(screen.getByRole("tab", { name: "Overview" }));

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Items" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Items content");

    await user.keyboard("{ArrowRight}"); // skips disabled "Audit log"
    expect(screen.getByRole("tab", { name: "Notes" })).toHaveFocus();

    await user.keyboard("{ArrowRight}"); // wraps to the start
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();

    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Notes" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();

    expect(onValueChange).toHaveBeenLastCalledWith("overview");
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs value="a" onValueChange={onValueChange}>
        <TabList aria-label="Controlled">
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>
    );
    await user.click(screen.getByRole("tab", { name: "B" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    // Parent didn't update `value`, so A stays selected.
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel A");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Example />);
    await expectNoA11yViolations(container);
  });
});
