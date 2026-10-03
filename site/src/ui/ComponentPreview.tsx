import type { ComponentType } from "react";
import { Tab, TabList, TabPanel, Tabs } from "flowpane";
import { inline } from "../lib/inline";
import { CodeBlock } from "./CodeBlock";

interface ComponentPreviewProps {
  title: string;
  description?: string;
  /** Anchor id for linking to this example. */
  id: string;
  Demo: ComponentType;
  code: string;
  /** Align the demo at the top instead of centring it (for tall demos like tables). */
  alignTop?: boolean;
}

/** Live example with Preview / Code tabs. The code shown is the example file's own source. */
export function ComponentPreview({ title, description, id, Demo, code, alignTop }: ComponentPreviewProps) {
  return (
    <section className="docs-example" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="docs-example__title">
        <a href={`#${id}`} id={id} className="docs-anchor">
          {title}
        </a>
      </h3>
      {description && <p className="docs-example__description">{inline(description)}</p>}
      <Tabs defaultValue="preview" className="docs-example__tabs">
        <TabList aria-label={`${title} example`}>
          <Tab value="preview">Preview</Tab>
          <Tab value="code">Code</Tab>
        </TabList>
        <TabPanel value="preview" className="docs-example__panel" tabIndex={-1}>
          <div className={alignTop ? "docs-preview docs-preview--top" : "docs-preview"}>
            <Demo />
          </div>
        </TabPanel>
        <TabPanel value="code" className="docs-example__panel">
          <CodeBlock code={code} title="Example.tsx" />
        </TabPanel>
      </Tabs>
    </section>
  );
}
