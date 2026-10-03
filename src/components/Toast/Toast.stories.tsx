import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { useToast } from "./Toast";

function ToastDemo() {
  const { toast, dismiss } = useToast();
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button variant="secondary" onClick={() => toast({ title: "Order saved", description: "A-102 was updated.", tone: "success" })}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Export started", description: "We'll email you when it's ready." })}>
        Info
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Card expires soon", description: "Update billing before 30 Sep.", tone: "warning" })}>
        Warning
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Payment failed", description: "The card was declined.", tone: "danger" })}>
        Danger
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          const id = toast({
            title: "3 orders archived",
            duration: 8000,
            action: (
              <Button size="sm" variant="secondary" onClick={() => dismiss(id)}>
                Undo
              </Button>
            )
          });
        }}
      >
        With action
      </Button>
    </div>
  );
}

const meta = {
  title: "Components/Toast",
  component: ToastDemo,
  parameters: {
    docs: {
      description: {
        component:
          "Wrap your app in `<ToastProvider>` and call `toast()` from `useToast()`. Toasts appear in a labelled notifications region; `danger` toasts use `role=\"alert\"`, others `role=\"status\"`. Auto-dismiss pauses while a toast is hovered or focused so people have time to read or act."
      },
      source: {
        code: `const { toast } = useToast();\n\ntoast({ title: "Order saved", description: "A-102 was updated.", tone: "success" });`
      }
    }
  }
} satisfies Meta<typeof ToastDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {};
