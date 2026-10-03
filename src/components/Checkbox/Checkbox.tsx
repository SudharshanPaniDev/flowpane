import { forwardRef, useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Visible label. Use `aria-label` instead only when a visible label is impossible (e.g. table rows). */
  label?: ReactNode;
  description?: ReactNode;
  /** Mixed state, e.g. a "select all" box when only some rows are selected. */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, id, className, ...rest },
  forwardedRef
) {
  const generated = useId();
  const inputId = id ?? `fp-checkbox-${generated}`;
  const descriptionId = `${inputId}-description`;
  const innerRef = useRef<HTMLInputElement | null>(null);

  // `indeterminate` is a DOM property only; it can't be set through an attribute.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const input = (
    <input
      ref={setRefs}
      id={inputId}
      type="checkbox"
      className="fp-checkbox__input"
      aria-describedby={description ? descriptionId : undefined}
      aria-checked={indeterminate ? "mixed" : undefined}
      {...rest}
    />
  );

  if (!label) {
    return <span className={cx("fp-checkbox", className)}>{input}</span>;
  }

  return (
    <div className={cx("fp-checkbox", className)}>
      {input}
      <label className="fp-checkbox__label" htmlFor={inputId}>
        {label}
      </label>
      {description && (
        <p className="fp-checkbox__description" id={descriptionId}>
          {description}
        </p>
      )}
    </div>
  );
});
