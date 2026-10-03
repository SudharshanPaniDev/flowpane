import { buildingBlocks, workflowComponents } from "../../docs";
import { Link } from "../../lib/router";

export function Introduction() {
  return (
    <>
      <p className="docs-eyebrow">Getting started</p>
      <h1>Introduction</h1>
      <p className="docs-lead">
        Flowpane is an open-source React component library for workflow-heavy business apps: admin panels, internal tools,
        and operations dashboards.
      </p>

      <h2 className="docs-h2">Why another component library?</h2>
      <p>
        General-purpose libraries give you buttons and dialogs, then leave you to build the hard parts of a back-office
        screen yourself: a table that sorts, searches, selects, and paginates; a multi-step flow; consistent statuses;
        helpful empty states. Flowpane ships those workflow pieces alongside the everyday primitives, all designed to work
        together.
      </p>

      <h2 className="docs-h2">What's included</h2>
      <div className="docs-two-col">
        <div>
          <h3 className="docs-h3">Workflow</h3>
          <ul className="docs-list">
            {workflowComponents.map((c) => (
              <li key={c.slug}>
                <Link to={`/components/${c.slug}`}>{c.name}</Link>: {c.summary}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="docs-h3">Building blocks</h3>
          <ul className="docs-list">
            {buildingBlocks.map((c) => (
              <li key={c.slug}>
                <Link to={`/components/${c.slug}`}>{c.name}</Link>: {c.summary}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="docs-h2">Principles</h2>
      <ul className="docs-list">
        <li>
          <strong>Accessible by default.</strong> Every component follows the WAI-ARIA Authoring Practices and is tested
          with axe-core. See <Link to="/docs/accessibility">Accessibility</Link>.
        </li>
        <li>
          <strong>Native first.</strong> Real <code>&lt;button&gt;</code>, <code>&lt;input&gt;</code>,{" "}
          <code>&lt;select&gt;</code>, and <code>&lt;table&gt;</code> elements, so browsers and assistive tech do the heavy
          lifting.
        </li>
        <li>
          <strong>Themeable without a framework.</strong> Plain CSS custom properties. See{" "}
          <Link to="/docs/theming">Theming</Link>.
        </li>
        <li>
          <strong>Typed.</strong> TypeScript throughout, with generics where they help, like <code>DataTable&lt;Order&gt;</code>.
        </li>
      </ul>

      <h2 className="docs-h2">Status</h2>
      <p>
        Version 0.1. The API may change before 1.0. Planned next: Combobox, DatePicker, Popover and Menu, and column
        filters for DataTable.
      </p>
    </>
  );
}
