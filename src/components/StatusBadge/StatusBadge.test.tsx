import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { EmptyState } from "../EmptyState/EmptyState";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders its label with a decorative dot", () => {
    const { container } = render(<StatusBadge tone="success">Paid</StatusBadge>);
    expect(screen.getByText("Paid")).toHaveClass("fp-badge--success");
    expect(container.querySelector(".fp-badge__dot")).toHaveAttribute("aria-hidden", "true");
  });

  it("can hide the dot", () => {
    const { container } = render(<StatusBadge dot={false}>Draft</StatusBadge>);
    expect(container.querySelector(".fp-badge__dot")).toBeNull();
  });
});

describe("EmptyState", () => {
  it("renders a heading at the requested level with its action", () => {
    render(
      <EmptyState
        title="No orders yet"
        description="Orders appear here once customers check out."
        action={<button type="button">Create order</button>}
        headingLevel={2}
      />
    );
    expect(screen.getByRole("heading", { level: 2, name: "No orders yet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create order" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <main>
        <StatusBadge tone="warning">Pending</StatusBadge>
        <EmptyState title="Nothing here" icon={<svg />} />
      </main>
    );
    await expectNoA11yViolations(container);
  });
});
