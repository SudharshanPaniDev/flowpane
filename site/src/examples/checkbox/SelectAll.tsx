import { useState } from "react";
import { Checkbox } from "flowpane";

const notifications = ["New orders", "Failed payments", "Refund requests"];

export default function Example() {
  const [checked, setChecked] = useState<string[]>(["Failed payments"]);
  const all = checked.length === notifications.length;

  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0, display: "grid", gap: 12 }}>
      <legend style={{ fontWeight: 600, marginBottom: 12 }}>Email me about</legend>
      <Checkbox
        label="All notifications"
        checked={all}
        indeterminate={checked.length > 0 && !all}
        onChange={() => setChecked(all ? [] : notifications)}
      />
      <div style={{ display: "grid", gap: 12, paddingLeft: 28 }}>
        {notifications.map((name) => (
          <Checkbox
            key={name}
            label={name}
            checked={checked.includes(name)}
            onChange={() =>
              setChecked((current) => (current.includes(name) ? current.filter((n) => n !== name) : [...current, name]))
            }
          />
        ))}
      </div>
    </fieldset>
  );
}
