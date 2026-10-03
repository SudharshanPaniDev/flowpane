import { forwardRef, type ReactNode, type SelectHTMLAttributes } from "react";
import { FieldShell } from "../TextField/FieldShell";
import { useFieldIds } from "../TextField/useFieldIds";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label: ReactNode;
  /** Options to render. Alternatively pass <option> elements as children. */
  options?: SelectOption[];
  /** Adds an empty first option, e.g. "Choose a status…". */
  placeholder?: string;
  description?: ReactNode;
  error?: ReactNode;
  wrapperClassName?: string;
}

/**
 * Styled native <select>. Native selects get keyboard, screen reader, and mobile behaviour right for free,
 * which is the best choice for simple option lists.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder, description, error, id, required, className, wrapperClassName, children, ...rest },
  ref
) {
  const ids = useFieldIds(id, Boolean(description), Boolean(error));

  return (
    <FieldShell
      {...ids}
      label={label}
      description={description}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <div className="fp-select-wrapper">
        <select
          ref={ref}
          id={ids.fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={ids.describedBy}
          className={["fp-select", className].filter(Boolean).join(" ")}
          {...rest}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options?.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
      </div>
    </FieldShell>
  );
});
