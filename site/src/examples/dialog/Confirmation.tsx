import { useState } from "react";
import { Button, Dialog } from "flowpane";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete 3 orders
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role="alertdialog"
        size="sm"
        title="Delete 3 orders?"
        description="These orders and their invoices will be permanently removed. This can't be undone."
        closeOnOverlayClick={false}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete orders
            </Button>
          </>
        }
      />
    </>
  );
}
