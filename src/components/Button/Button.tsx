import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Use `primary` for the main action in a view, `danger` for destructive actions. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and blocks clicks while keeping the label readable to screen readers. */
  loading?: boolean;
  /** Icon rendered before the label. */
  iconStart?: ReactNode;
  /** Icon rendered after the label. */
  iconEnd?: ReactNode;
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    iconStart,
    iconEnd,
    fullWidth = false,
    disabled,
    type = "button",
    className,
    children,
    onClick,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        "fp-button",
        `fp-button--${variant}`,
        size !== "md" && `fp-button--${size}`,
        fullWidth && "fp-button--full",
        className
      )}
      disabled={disabled}
      // While loading, stay focusable (so focus isn't lost) but ignore activation.
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...rest}
    >
      {loading ? (
        <span className="fp-spinner" aria-hidden="true" />
      ) : (
        iconStart && <span className="fp-button__icon" aria-hidden="true">{iconStart}</span>
      )}
      {children}
      {iconEnd && !loading && <span className="fp-button__icon" aria-hidden="true">{iconEnd}</span>}
    </button>
  );
});
