import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { AlertIcon } from "../../utils/icons";

interface FieldShellProps {
  fieldId: string;
  descriptionId: string;
  errorId: string;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** Shared label / description / error layout for form fields. */
export function FieldShell({
  fieldId,
  descriptionId,
  errorId,
  label,
  description,
  error,
  required,
  className,
  children
}: FieldShellProps) {
  return (
    <div className={cx("fp-field", className)}>
      <label className="fp-field__label" htmlFor={fieldId}>
        {label}
        {required && (
          <span className="fp-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {description && (
        <p className="fp-field__description" id={descriptionId}>
          {description}
        </p>
      )}
      {children}
      {error && (
        <p className="fp-field__error" id={errorId}>
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  );
}
