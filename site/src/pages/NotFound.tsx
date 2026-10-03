import { Button } from "flowpane";
import { useRouter } from "../lib/router";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export function NotFound() {
  useDocumentTitle("Page not found");
  const { navigate } = useRouter();
  return (
    <div className="docs-page">
      <article className="docs-article">
        <p className="docs-eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="docs-lead">That page doesn't exist. Try the search, or start from the introduction.</p>
        <Button onClick={() => navigate("/docs/introduction")}>Go to the docs</Button>
      </article>
    </div>
  );
}
