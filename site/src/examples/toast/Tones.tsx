import { Button, useToast } from "flowpane";

// Wrap your app once in <ToastProvider>, then call toast() from anywhere.
export default function Example() {
  const { toast } = useToast();

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button variant="secondary" onClick={() => toast({ title: "Order saved", description: "A-102 was updated.", tone: "success" })}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Export started", description: "We'll email you when it's ready." })}>
        Info
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Card expires soon", tone: "warning" })}>
        Warning
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Payment failed", description: "The card was declined.", tone: "danger" })}>
        Danger
      </Button>
    </div>
  );
}
