import type { ReactNode } from "react";
import { guides } from "../docs";
import { Link } from "../lib/router";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export function GuidePage({ slug, children }: { slug: string; children: ReactNode }) {
  const index = guides.findIndex((g) => g.slug === slug);
  const guide = guides[index]!;
  const prev = guides[index - 1];
  const next = guides[index + 1];
  useDocumentTitle(guide.title);

  return (
    <div className="docs-page">
      <article className="docs-article docs-prose">
        {children}
        <nav className="docs-pager" aria-label="Previous and next page">
          {prev ? (
            <Link to={`/docs/${prev.slug}`} className="docs-pager__link">
              <span>Previous</span>
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/docs/${next.slug}`} className="docs-pager__link docs-pager__link--next">
              <span>Next</span>
              {next.title}
            </Link>
          ) : (
            <Link to="/components/data-table" className="docs-pager__link docs-pager__link--next">
              <span>Next</span>
              Components
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
