import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { FieldShell } from "./FieldShell";
import { useFieldIds } from "./useFieldIds";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visible label. Required: every field needs an accessible name. */
  label: ReactNode;
  /** Hint shown under the label and announced with the field. */
  description?: ReactNode;
  /** Error message. Marks the field invalid and is announced with it. */
  error?: ReactNode;
  /** Class name for the outer wrapper (use `className` for the input itself). */
  wrapperClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, description, error, id, required, className, wrapperClassName, type = "text", ...rest },
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
      <input
        ref={ref}
        id={ids.fieldId}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={ids.describedBy}
        className={["fp-input", className].filter(Boolean).join(" ")}
        {...rest}
      />
    </FieldShell>
  );
});
