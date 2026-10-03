import { Button, StatusBadge } from "flowpane";
import { OrdersAdmin } from "../../../src/stories/OrdersAdmin";
import { buildingBlocks, workflowComponents } from "../docs";
import { Footer } from "../layout/Footer";
import { Header } from "../layout/Header";
import { Link, useRouter } from "../lib/router";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { CopyButton } from "../ui/CopyButton";

const features = [
  {
    title: "Accessible by default",
    body: "WAI-ARIA patterns, full keyboard support, focus management, and live announcements. Every component is tested with axe-core."
  },
  {
    title: "Built for workflows",
    body: "A DataTable with sorting, search, selection, and bulk actions, plus steppers and status badges: the parts general libraries leave to you."
  },
  {
    title: "Themeable with CSS",
    body: "Plain CSS custom properties. Match your brand in a few lines, with no Tailwind or CSS-in-JS required. Light and dark included."
  },
  {
    title: "Typed and lightweight",
    body: "Written in TypeScript with generics where they matter. Tree-shakeable ESM, ~64 kB packed, and React is the only dependency."
  }
];

export function HomePage() {
  useDocumentTitle("");
  const { navigate } = useRouter();

  return (
    <>
      <Header />
      <main id="main" className="home">
        <section className="home-hero" aria-labelledby="home-title">
          <StatusBadge tone="info">v0.1 · Open source · MIT</StatusBadge>
          <h1 id="home-title">
            React components for the <span className="home-hero__accent">hard parts</span> of business apps.
          </h1>
          <p className="home-hero__lead">
            Flowpane is an accessible component library for admin panels, internal tools, and dashboards: data tables,
            steppers, dialogs, and the everyday pieces around them.
          </p>
          <div className="home-hero__actions">
            <Button size="lg" onClick={() => navigate("/docs/installation")}>
              Get started
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate("/components/data-table")}>
              Browse components
            </Button>
          </div>
          <div className="home-install">
            <code>
              <span aria-hidden="true">$ </span>npm install flowpane
            </code>
            <CopyButton text="npm install flowpane" label="Copy" />
          </div>
        </section>

        <section className="home-demo" aria-labelledby="demo-title">
          <div className="home-section-heading">
            <h2 id="demo-title">Try it: a real back-office screen</h2>
            <p>
              Built only from Flowpane components. Search, sort, select rows, cancel orders, undo, or create a new order
              through a multi-step dialog.
            </p>
          </div>
          <div className="home-demo__frame">
            <div className="home-demo__bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <p>app.example.com/orders</p>
            </div>
            <div className="home-demo__body">
              <OrdersAdmin headingLevel={3} />
            </div>
          </div>
        </section>

        <section className="home-features" aria-labelledby="features-title">
          <h2 id="features-title" className="fp-visually-hidden">
            Why Flowpane
          </h2>
          <ul>
            {features.map((f) => (
              <li key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-components" aria-labelledby="components-title">
          <div className="home-section-heading">
            <h2 id="components-title">Components</h2>
            <p>Eleven components in v0.1, each with live examples, code, props, and accessibility notes.</p>
          </div>
          {[
            { title: "Workflow", items: workflowComponents },
            { title: "Building blocks", items: buildingBlocks }
          ].map((group) => (
            <div key={group.title} className="home-components__group">
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/components/${c.slug}`} className="home-card">
                      <span className="home-card__name">{c.name}</span>
                      <span className="home-card__summary">{c.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <div className="home-footer">
          <Footer />
        </div>
      </main>
    </>
  );
}
