import { useMemo } from "react";
import { highlight } from "sugar-high";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  code: string;
  /** Shown in the header bar, e.g. a file name or "bash". */
  title?: string;
  /** Plain text (no highlighting), e.g. shell commands or CSS. */
  plain?: boolean;
}

export function CodeBlock({ code, title, plain = false }: CodeBlockProps) {
  const trimmed = code.trim();
  const html = useMemo(() => (plain ? null : highlight(trimmed)), [trimmed, plain]);

  return (
    <div className="docs-code">
      <div className="docs-code__bar">
        <span className="docs-code__title">{title}</span>
        <CopyButton text={trimmed} />
      </div>
      {/* tabIndex lets keyboard users scroll long code horizontally. */}
      <pre tabIndex={0}>
        {html ? <code dangerouslySetInnerHTML={{ __html: html }} /> : <code>{trimmed}</code>}
      </pre>
    </div>
  );
}
