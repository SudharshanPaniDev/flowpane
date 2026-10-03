import type { ReactNode } from "react";
import { cx } from "../../utils/cx";

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  /** Decorative icon shown above the title. */
  icon?: ReactNode;
  /** Next step for the user, e.g. a "Create order" or "Clear filters" button. */
  action?: ReactNode;
  /** Heading level for the title so it fits the surrounding document outline. Default 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function EmptyState({ title, description, icon, action, headingLevel = 3, className }: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <div className={cx("fp-empty", className)}>
      {icon && (
        <div className="fp-empty__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <Heading className="fp-empty__title">{title}</Heading>
      {description && <p className="fp-empty__description">{description}</p>}
      {action && <div className="fp-empty__action">{action}</div>}
    </div>
  );
}
