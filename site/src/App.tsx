import type { ComponentType } from "react";
import { ToastProvider } from "flowpane";
import { components } from "./docs";
import { DocsLayout } from "./layout/DocsLayout";
import { useRouter } from "./lib/router";
import { ComponentPage } from "./pages/ComponentPage";
import { GuidePage } from "./pages/GuidePage";
import { Accessibility } from "./pages/guides/Accessibility";
import { Installation } from "./pages/guides/Installation";
import { Introduction } from "./pages/guides/Introduction";
import { Theming } from "./pages/guides/Theming";
import { HomePage } from "./pages/HomePage";
import { NotFound } from "./pages/NotFound";

const guidePages: Record<string, ComponentType> = {
  introduction: Introduction,
  installation: Installation,
  theming: Theming,
  accessibility: Accessibility
};

function Routes() {
  const { path } = useRouter();
  const clean = path.replace(/\/+$/, "") || "/";

  if (clean === "/") return <HomePage />;
  if (clean === "/docs") return <DocsLayout><GuidePage slug="introduction"><Introduction /></GuidePage></DocsLayout>;

  const guide = clean.match(/^\/docs\/([\w-]+)$/)?.[1];
  const Guide = guide ? guidePages[guide] : undefined;
  if (guide && Guide) {
    return (
      <DocsLayout>
        <GuidePage key={guide} slug={guide}>
          <Guide />
        </GuidePage>
      </DocsLayout>
    );
  }

  const slug = clean.match(/^\/components\/([\w-]+)$/)?.[1];
  const doc = components.find((c) => c.slug === slug);
  if (doc) {
    return (
      <DocsLayout>
        <ComponentPage key={doc.slug} doc={doc} />
      </DocsLayout>
    );
  }

  return (
    <DocsLayout>
      <NotFound />
    </DocsLayout>
  );
}

export function App() {
  return (
    <ToastProvider>
      <a href="#main" className="docs-skip-link">
        Skip to content
      </a>
      <Routes />
    </ToastProvider>
  );
}
