import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
  /** Show a leading dot. Colour is never the only signal: the label always carries the meaning. */
  dot?: boolean;
  children: ReactNode;
}

export function StatusBadge({ tone = "neutral", dot = true, className, children, ...rest }: StatusBadgeProps) {
  return (
    <span className={cx("fp-badge", `fp-badge--${tone}`, className)} {...rest}>
      {dot && <span className="fp-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
