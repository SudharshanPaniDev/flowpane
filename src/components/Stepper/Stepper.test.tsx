import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Stepper } from "./Stepper";

const steps = [
  { id: "details", label: "Details" },
  { id: "items", label: "Items" },
  { id: "shipping", label: "Shipping" },
  { id: "review", label: "Review" }
];

describe("Stepper", () => {
  it("marks the current step and announces progress", () => {
    render(<Stepper steps={steps} currentStep={2} />);
    const list = screen.getByRole("list", { name: "Progress" });
    const items = within(list).getAllByRole("listitem");
    expect(items[2]).toHaveAttribute("aria-current", "step");
    expect(items[0]).toHaveTextContent("Details, step 1 of 4, Completed");
    expect(items[2]).toHaveTextContent("Shipping, step 3 of 4, Current step");
    expect(items[3]).toHaveTextContent("Review, step 4 of 4, Not started");
  });

  it("lets users jump back to completed steps only", async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<Stepper steps={steps} currentStep={2} onStepClick={onStepClick} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2); // Details and Items are complete
    await user.click(screen.getByRole("button", { name: /Items/ }));
    expect(onStepClick).toHaveBeenCalledWith(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Stepper steps={steps} currentStep={1} onStepClick={() => {}} />);
    await expectNoA11yViolations(container);
  });
});
