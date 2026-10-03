import { buildingBlocks, guides, workflowComponents } from "../docs";
import { Link } from "../lib/router";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const groups = [
    { title: "Getting started", links: guides.map((g) => ({ to: `/docs/${g.slug}`, label: g.title })) },
    { title: "Workflow", links: workflowComponents.map((c) => ({ to: `/components/${c.slug}`, label: c.name })) },
    { title: "Building blocks", links: buildingBlocks.map((c) => ({ to: `/components/${c.slug}`, label: c.name })) }
  ];

  return (
    <nav aria-label="Documentation" className="docs-sidebar__nav">
      {groups.map((group) => (
        <div key={group.title} className="docs-sidebar__group">
          <h2 className="docs-sidebar__heading">{group.title}</h2>
          <ul>
            {group.links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="docs-sidebar__link" onClick={onNavigate}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
