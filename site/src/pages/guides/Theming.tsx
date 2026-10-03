import { useMemo, useState, type CSSProperties } from "react";
import { Button, Checkbox, StatusBadge, Stepper, Tab, TabList, TabPanel, Tabs, TextField } from "flowpane";
import { CodeBlock } from "../../ui/CodeBlock";

const presets = [
  { name: "Blue", value: "#2563eb" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Emerald", value: "#047857" },
  { name: "Rose", value: "#be123c" },
  { name: "Slate", value: "#334155" }
];

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
}

function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Mixes a colour toward black (amount > 0) or white (amount < 0). */
function shade(hex: string, amount: number) {
  const target = amount > 0 ? 0 : 255;
  const t = Math.abs(amount);
  return (
    "#" +
    hexToRgb(hex)
      .map((c) => Math.round(c + (target - c) * t).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function Theming() {
  const [accent, setAccent] = useState("#7c3aed");
  const [radius, setRadius] = useState(10);

  const tokens = useMemo(() => {
    const [r, g, b] = hexToRgb(accent);
    return {
      "--fp-color-accent": accent,
      "--fp-color-accent-hover": shade(accent, 0.15),
      "--fp-color-accent-text": shade(accent, 0.15),
      "--fp-color-accent-soft": shade(accent, -0.9),
      "--fp-color-accent-soft-fg": shade(accent, 0.45),
      "--fp-focus-ring": `0 0 0 3px rgb(${r} ${g} ${b} / 0.35)`,
      "--fp-radius-sm": `${Math.max(0, radius - 4)}px`,
      "--fp-radius-md": `${radius}px`,
      "--fp-radius-lg": `${radius + 4}px`
    };
  }, [accent, radius]);

  const ratio = contrast("#ffffff", accent);
  const passes = ratio >= 4.5;
  const css = `:root {\n${Object.entries(tokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n")}\n}`;

  return (
    <>
      <p className="docs-eyebrow">Getting started</p>
      <h1>Theming</h1>
      <p className="docs-lead">
        Flowpane is styled with plain CSS and <code>--fp-*</code> custom properties. Override them after importing{" "}
        <code>flowpane/styles.css</code>. No build step or framework needed.
      </p>

      <h2 className="docs-h2">Playground</h2>
      <p>Pick a brand colour and corner radius. The components below update live, and the CSS is ready to copy.</p>

      <div className="theme-playground">
        <div className="theme-playground__controls">
          <fieldset className="theme-presets">
            <legend>Accent colour</legend>
            <div className="theme-presets__swatches">
              {presets.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className="theme-swatch"
                  style={{ background: p.value }}
                  aria-label={p.name}
                  aria-pressed={accent === p.value}
                  onClick={() => setAccent(p.value)}
                />
              ))}
              <label className="theme-custom">
                <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
                <span>Custom</span>
              </label>
            </div>
          </fieldset>
          <div className="theme-radius">
            <label htmlFor="radius">Corner radius: {radius}px</label>
            <input id="radius" type="range" min={0} max={20} value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
          </div>
          <p className={passes ? "theme-contrast theme-contrast--pass" : "theme-contrast theme-contrast--fail"} role="status">
            White text on this colour: <strong>{ratio.toFixed(2)}:1</strong>{" "}
            {passes ? "· passes WCAG AA" : "· below 4.5:1, pick a darker shade for accessible buttons"}
          </p>
        </div>

        <div className="theme-playground__preview" style={tokens as CSSProperties}>
          <Tabs defaultValue="details">
            <TabList aria-label="Theme preview">
              <Tab value="details">Details</Tab>
              <Tab value="billing">Billing</Tab>
            </TabList>
            <TabPanel value="details" tabIndex={-1}>
              <div style={{ display: "grid", gap: 16 }}>
                <Stepper
                  steps={[
                    { id: "a", label: "Account" },
                    { id: "b", label: "Team" },
                    { id: "c", label: "Billing" }
                  ]}
                  currentStep={1}
                  aria-label="Preview progress"
                />
                <TextField label="Workspace name" defaultValue="Northwind Ops" />
                <Checkbox label="Send me product updates" defaultChecked />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <Button>Save changes</Button>
                  <Button variant="secondary">Cancel</Button>
                  <StatusBadge tone="info">In review</StatusBadge>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="billing" tabIndex={-1}>
              Billing settings would go here.
            </TabPanel>
          </Tabs>
        </div>
      </div>
      <CodeBlock code={css} title="theme.css" plain />

      <h2 className="docs-h2">Dark mode</h2>
      <p>
        Dark mode follows the operating system by default. To control it, set <code>data-fp-theme</code> on{" "}
        <code>&lt;html&gt;</code> or any wrapper:
      </p>
      <CodeBlock
        title="index.html"
        plain
        code={`<html data-fp-theme="dark">   <!-- always dark -->
<html data-fp-theme="light">  <!-- always light, even if the OS is dark -->`}
      />

      <h2 className="docs-h2">Scoped themes</h2>
      <p>Tokens are ordinary CSS variables, so one area of a page can have its own theme:</p>
      <CodeBlock
        title="billing.css"
        plain
        code={`.billing-panel {
  --fp-color-accent: #047857;
  --fp-color-accent-hover: #065f46;
}`}
      />

      <h2 className="docs-h2">Token reference</h2>
      <div className="docs-table-scroll">
        <table className="docs-table">
          <caption className="fp-visually-hidden">Design tokens</caption>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["--fp-color-bg / -bg-subtle / -surface", "Page, muted, and card backgrounds"],
              ["--fp-color-text / -text-muted / -text-subtle", "Text hierarchy"],
              ["--fp-color-border / -border-strong", "Dividers and input borders"],
              ["--fp-color-accent*", "Primary actions, selection, focus"],
              ["--fp-color-danger* / success* / warning* / neutral-soft*", "Status colours"],
              ["--fp-radius-sm / md / lg / full", "Corner radius scale"],
              ["--fp-space-1 … --fp-space-8", "Spacing scale"],
              ["--fp-font-sans", "Font family"],
              ["--fp-focus-ring", "Keyboard focus indicator"]
            ].map(([token, purpose]) => (
              <tr key={token}>
                <td>
                  <code>{token}</code>
                </td>
                <td>{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
