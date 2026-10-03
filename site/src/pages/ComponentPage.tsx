import { components, type ComponentDoc } from "../docs";
import { inline } from "../lib/inline";
import { Link } from "../lib/router";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { CodeBlock } from "../ui/CodeBlock";
import { ComponentPreview } from "../ui/ComponentPreview";
import { KeyboardTable } from "../ui/KeyboardTable";
import { PropsTable } from "../ui/PropsTable";

export function ComponentPage({ doc }: { doc: ComponentDoc }) {
  useDocumentTitle(doc.name);
  const index = components.indexOf(doc);
  const prev = components[index - 1];
  const next = components[index + 1];

  const toc = [
    ...doc.examples.map((e) => ({ id: e.id, label: e.title })),
    { id: "api", label: "API reference" },
    ...(doc.keyboard ? [{ id: "keyboard", label: "Keyboard" }] : []),
    { id: "accessibility", label: "Accessibility" }
  ];

  return (
    <div className="docs-page docs-page--with-toc">
      <article className="docs-article">
        <p className="docs-eyebrow">{doc.category}</p>
        <h1>{doc.name}</h1>
        <p className="docs-lead">{doc.description}</p>
        <CodeBlock code={doc.importCode} title="Import" />

        <h2 className="docs-h2">Examples</h2>
        {doc.examples.map((ex) => (
          <ComponentPreview
            key={ex.id}
            id={ex.id}
            title={ex.title}
            description={ex.description}
            Demo={ex.Demo}
            code={ex.code}
            alignTop={ex.alignTop}
          />
        ))}

        <h2 id="api" className="docs-h2">
          API reference
        </h2>
        {doc.props.map((group) => (
          <section key={group.component} aria-labelledby={`api-${group.component}`} className="docs-api">
            <h3 id={`api-${group.component}`} className="docs-h3">
              <code>{group.component}</code>
            </h3>
            <PropsTable props={group.props} caption={`${group.component} props`} />
          </section>
        ))}

        {doc.keyboard && (
          <>
            <h2 id="keyboard" className="docs-h2">
              Keyboard
            </h2>
            <KeyboardTable items={doc.keyboard} caption={`${doc.name} keyboard interactions`} />
          </>
        )}

        <h2 id="accessibility" className="docs-h2">
          Accessibility
        </h2>
        <ul className="docs-list">
          {doc.accessibility.map((item) => (
            <li key={item}>{inline(item)}</li>
          ))}
        </ul>

        <nav className="docs-pager" aria-label="Previous and next component">
          {prev ? (
            <Link to={`/components/${prev.slug}`} className="docs-pager__link">
              <span>Previous</span>
              {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/components/${next.slug}`} className="docs-pager__link docs-pager__link--next">
              <span>Next</span>
              {next.name}
            </Link>
          )}
        </nav>
      </article>

      <aside className="docs-toc" aria-label="On this page">
        <p className="docs-toc__title">On this page</p>
        <ul>
          {toc.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
