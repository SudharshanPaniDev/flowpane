import { useState } from "react";
import { Button, useToast } from "flowpane";

export default function Example() {
  const { toast, dismiss } = useToast();
  const [archived, setArchived] = useState(false);

  const archive = () => {
    setArchived(true);
    const id = toast({
      title: "Order A-102 archived",
      duration: 8000,
      action: (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setArchived(false);
            dismiss(id);
          }}
        >
          Undo
        </Button>
      )
    });
  };

  return (
    <Button variant="secondary" onClick={archive} disabled={archived}>
      {archived ? "Archived" : "Archive order"}
    </Button>
  );
}
