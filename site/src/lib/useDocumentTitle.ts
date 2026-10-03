import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · Flowpane` : "Flowpane · Accessible React components for workflow-heavy apps";
  }, [title]);
}
