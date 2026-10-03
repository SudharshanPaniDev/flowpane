import type { Meta, StoryObj } from "@storybook/react-vite";
import { orderColumns } from "../../stories/orderColumns";
import { orders, type Order } from "../../stories/sampleData";
import { Button } from "../Button/Button";
import { EmptyState } from "../EmptyState/EmptyState";
import { DataTable } from "./DataTable";

const meta = {
  title: "Components/DataTable",
  component: DataTable<Order>,
  args: {
    data: orders,
    columns: orderColumns,
    getRowId: (o: Order) => o.id,
    caption: "Recent orders"
  },
  parameters: {
    docs: {
      description: {
        component:
          "Typed table for operational data: sorting (with `aria-sort`), search across columns, row selection with an indeterminate \"select all\", pagination, a toolbar slot that receives the selection for bulk actions, and empty / no-results states. Sorting and search results are announced to screen readers through a polite live region."
      }
    }
  }
} satisfies Meta<typeof DataTable<Order>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { args: { pageSize: 8 } };

export const SearchAndSort: Story = {
  args: {
    searchable: true,
    searchPlaceholder: "Search orders or customers…",
    defaultSort: { columnId: "placedAt", direction: "desc" },
    pageSize: 8
  }
};

export const SelectionWithBulkActions: Story = {
  args: {
    searchable: true,
    selectable: true,
    pageSize: 8,
    getRowLabel: (o: Order) => `Select order ${o.id}`,
    toolbar: ({ selectedIds, clearSelection }) =>
      selectedIds.length > 0 ? (
        <>
          <Button variant="secondary" size="sm" onClick={clearSelection}>
            Mark as shipped
          </Button>
          <Button variant="danger" size="sm" onClick={clearSelection}>
            Cancel {selectedIds.length}
          </Button>
        </>
      ) : (
        <Button size="sm">Export CSV</Button>
      )
  }
};

export const Empty: Story = {
  args: {
    data: [],
    searchable: true,
    emptyState: (
      <EmptyState
        title="No orders yet"
        description="Orders appear here as soon as customers check out."
        action={<Button>Create order</Button>}
      />
    )
  }
};
