import { StatusBadge } from "flowpane";

export default function Example() {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <StatusBadge tone="neutral">Draft</StatusBadge>
      <StatusBadge tone="info">In review</StatusBadge>
      <StatusBadge tone="success">Paid</StatusBadge>
      <StatusBadge tone="warning">Pending</StatusBadge>
      <StatusBadge tone="danger">Failed</StatusBadge>
      <StatusBadge tone="neutral" dot={false}>
        Archived
      </StatusBadge>
    </div>
  );
}
