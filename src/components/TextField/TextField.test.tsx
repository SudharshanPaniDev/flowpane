import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Select } from "../Select/Select";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("links the label, description, and error to the input", () => {
    render(<TextField label="Email" description="We'll send the invoice here." error="Enter a valid email" />);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAccessibleDescription("We'll send the invoice here. Enter a valid email");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("is not marked invalid without an error", () => {
    render(<TextField label="Name" />);
    expect(screen.getByRole("textbox", { name: "Name" })).not.toHaveAttribute("aria-invalid");
  });

  it("accepts typing and forwards native props", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Order number" required onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: /order number/i });
    expect(input).toBeRequired();
    await user.type(input, "A-102");
    expect(input).toHaveValue("A-102");
    expect(onChange).toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <>
        <TextField label="Email" description="Work email" error="Required" required />
        <Select label="Status" placeholder="Choose…" options={[{ value: "open", label: "Open" }]} />
      </>
    );
    await expectNoA11yViolations(container);
  });
});

describe("Select", () => {
  it("renders options and reports changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select
        label="Status"
        options={[
          { value: "open", label: "Open" },
          { value: "closed", label: "Closed" }
        ]}
        onChange={onChange}
      />
    );
    const select = screen.getByRole("combobox", { name: "Status" });
    await user.selectOptions(select, "closed");
    expect(select).toHaveValue("closed");
    expect(onChange).toHaveBeenCalled();
  });
});
