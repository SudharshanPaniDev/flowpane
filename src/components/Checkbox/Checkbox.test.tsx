import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("toggles when its label is clicked", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Email me updates" />);
    const box = screen.getByRole("checkbox", { name: "Email me updates" });
    await user.click(screen.getByText("Email me updates"));
    expect(box).toBeChecked();
  });

  it("supports the indeterminate (mixed) state", () => {
    render(<Checkbox label="Select all" indeterminate />);
    const box = screen.getByRole("checkbox", { name: "Select all" }) as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
    expect(box).toHaveAttribute("aria-checked", "mixed");
  });

  it("describes itself with the description text", () => {
    render(<Checkbox label="Archive" description="Archived orders are hidden from the list." />);
    expect(screen.getByRole("checkbox")).toHaveAccessibleDescription("Archived orders are hidden from the list.");
  });

  it("renders and links the description when there is no visible label", async () => {
    const { container } = render(<Checkbox aria-label="Select order A-102" description="Ships tomorrow" />);
    const box = screen.getByRole("checkbox", { name: "Select order A-102" });
    expect(box).toHaveAccessibleDescription("Ships tomorrow");
    await expectNoA11yViolations(container);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <>
        <Checkbox label="Accept terms" />
        <Checkbox aria-label="Select row 1" />
      </>
    );
    await expectNoA11yViolations(container);
  });
});
