import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expectNoA11yViolations } from "../../test/axe";
import { Button } from "../Button/Button";
import { Dialog } from "./Dialog";

function Example({ closeOnOverlayClick }: { closeOnOverlayClick?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete order</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete order A-102?"
        description="This can't be undone."
        closeOnOverlayClick={closeOnOverlayClick}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger">Delete</Button>
          </>
        }
      />
    </>
  );
}

describe("Dialog", () => {
  it("opens as a labelled modal and moves focus inside", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Delete order" }));
    const dialog = screen.getByRole("dialog", { name: "Delete order A-102?" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("This can't be undone.");
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Delete order" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps Tab and Shift+Tab inside the dialog", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Delete order" }));
    // Focus order: Close (×), Cancel, Delete. Starts on Cancel.
    await user.tab();
    expect(screen.getByRole("button", { name: "Delete" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Delete" })).toHaveFocus();
  });

  it("closes on overlay click unless disabled", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Example />);
    await user.click(screen.getByRole("button", { name: "Delete order" }));
    await user.click(document.querySelector(".fp-dialog-overlay")!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();

    render(<Example closeOnOverlayClick={false} />);
    await user.click(screen.getByRole("button", { name: "Delete order" }));
    await user.click(document.querySelector(".fp-dialog-overlay")!);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("locks page scroll while open", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Delete order" }));
    expect(document.body.style.overflow).toBe("hidden");
    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("");
  });

  it("has no accessibility violations when open", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Delete order" }));
    await expectNoA11yViolations(document.body);
  });
});
