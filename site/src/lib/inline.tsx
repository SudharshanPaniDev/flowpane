import { Fragment, type ReactNode } from "react";

/** Renders `backtick` spans in plain strings as <code>. */
export function inline(text: string): ReactNode {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? <code key={i}>{part.slice(1, -1)}</code> : <Fragment key={i}>{part}</Fragment>
  );
}
