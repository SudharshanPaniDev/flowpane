import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrdersAdmin } from "./OrdersAdmin";

const meta = {
  title: "Examples/Orders admin",
  component: OrdersAdmin,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A realistic back-office screen built only from Flowpane components: tabbed views with counts, a searchable, sortable, selectable DataTable with bulk actions, an alert dialog for destructive confirmation, a toast with Undo, and a multi-step \"New order\" dialog with a Stepper and validation."
      }
    }
  }
} satisfies Meta<typeof OrdersAdmin>;

export default meta;

export const OrdersAdminPage: StoryObj<typeof meta> = { name: "Orders admin" };
