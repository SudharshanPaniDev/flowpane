import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Button } from "../Button/Button";
import { ToastProvider, useToast, type ToastOptions } from "./Toast";

function Trigger(options: ToastOptions) {
  const { toast } = useToast();
  return <Button onClick={() => toast(options)}>Notify</Button>;
}

describe("Toast", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("announces toasts in a labelled notifications region", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger title="Order saved" description="A-102 was updated." tone="success" />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", { name: "Notify" }));
    const region = screen.getByRole("region", { name: "Notifications" });
    const toast = screen.getByRole("status");
    expect(region).toContainElement(toast);
    expect(toast).toHaveTextContent("Order saved");
  });

  it("uses role=alert for danger toasts", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger title="Payment failed" tone="danger" />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", { name: "Notify" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Payment failed");
  });

  it("dismisses with the close button", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger title="Saved" />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", { name: "Notify" }));
    await user.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("auto-dismisses after its duration and pauses while hovered", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <ToastProvider>
        <Trigger title="Saved" duration={1000} />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", { name: "Notify" }));
    const toast = screen.getByRole("status");

    await user.hover(toast);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByRole("status")).toBeInTheDocument();

    await user.unhover(toast);
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("keeps at most `limit` toasts", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider limit={2}>
        <Trigger title="Saved" duration={Infinity} />
      </ToastProvider>
    );
    const button = screen.getByRole("button", { name: "Notify" });
    await user.click(button);
    await user.click(button);
    await user.click(button);
    expect(screen.getAllByRole("status")).toHaveLength(2);
  });

  it("throws a helpful error outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Trigger title="x" />)).toThrow("useToast must be used inside <ToastProvider>.");
    spy.mockRestore();
  });

  it("has no accessibility violations", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger title="Saved" description="All changes stored." />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", { name: "Notify" }));
    await expectNoA11yViolations(document.body);
  });
});
