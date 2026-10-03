import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";
import { Button } from "../Button/Button";
import { TextField } from "../TextField/TextField";
import { Dialog, type DialogProps } from "./Dialog";

type DemoProps = Omit<DialogProps, "open" | "onOpenChange" | "footer"> & {
  triggerLabel: string;
  confirmLabel: string;
  danger?: boolean;
};

function DialogDemo({ triggerLabel, confirmLabel, danger, ...dialogProps }: DemoProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const footer: ReactNode = (
    <>
      <Button variant="secondary" onClick={close}>
        Cancel
      </Button>
      <Button variant={danger ? "danger" : "primary"} onClick={close}>
        {confirmLabel}
      </Button>
    </>
  );
  return (
    <>
      <Button variant={danger ? "danger" : "primary"} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Dialog {...dialogProps} open={open} onOpenChange={setOpen} footer={footer} />
    </>
  );
}

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  args: { open: false, onOpenChange: () => {}, title: "Dialog" },
  parameters: {
    docs: {
      description: {
        component:
          "Modal dialog rendered in a portal. Moves focus inside when opened, keeps Tab cycling within it, closes on Escape, restores focus to the trigger on close, and locks page scroll. Labelled by its title and described by its description. Use `role=\"alertdialog\"` for destructive confirmations."
      }
    }
  }
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmation: Story = {
  render: () => (
    <DialogDemo
      triggerLabel="Delete 3 orders"
      confirmLabel="Delete orders"
      danger
      role="alertdialog"
      size="sm"
      title="Delete 3 orders?"
      description="These orders and their invoices will be permanently removed. This can't be undone."
      closeOnOverlayClick={false}
    />
  )
};

export const WithForm: Story = {
  render: () => (
    <DialogDemo
      triggerLabel="Edit customer"
      confirmLabel="Save changes"
      title="Edit customer"
      description="Changes apply to all future orders."
    >
      <div style={{ display: "grid", gap: 16 }}>
        <TextField label="Company name" defaultValue="Northwind Traders" />
        <TextField label="Billing email" type="email" defaultValue="billing@northwind.com" />
      </div>
    </DialogDemo>
  )
};
