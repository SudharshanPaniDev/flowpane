import { useState } from "react";
import { Button, Dialog, TextField } from "flowpane";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Edit customer
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Edit customer"
        description="Changes apply to all future orders."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save changes</Button>
          </>
        }
      >
        <div style={{ display: "grid", gap: 16 }}>
          <TextField label="Company name" defaultValue="Northwind Traders" />
          <TextField label="Billing email" type="email" defaultValue="billing@northwind.com" />
        </div>
      </Dialog>
    </>
  );
}
