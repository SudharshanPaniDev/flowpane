import { useState } from "react";
import { Button } from "flowpane";

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default function Example() {
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button iconStart={<PlusIcon />} variant="secondary">
        New order
      </Button>
      <Button loading={saving} onClick={save}>
        {saving ? "Saving…" : "Save order"}
      </Button>
    </div>
  );
}
