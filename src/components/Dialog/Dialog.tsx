import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../utils/cx";
import { getFocusable } from "../../utils/focus";
import { CloseIcon } from "../../utils/icons";

export interface DialogProps {
  open: boolean;
  /** Called with `false` when the user asks to close (Escape, overlay click, close button). */
  onOpenChange: (open: boolean) => void;
  /** Heading for the dialog; also its accessible name. */
  title: ReactNode;
  /** Supporting text under the title; announced when the dialog opens. */
  description?: ReactNode;
  children?: ReactNode;
  /** Actions row, typically a secondary "Cancel" and a primary confirm button. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Close when clicking the dimmed backdrop. Turn off for flows where accidental dismissal loses work. */
  closeOnOverlayClick?: boolean;
  /** Show the × button in the header. */
  showCloseButton?: boolean;
  /** Element to focus when the dialog opens. Defaults to the first focusable element in the body or footer. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /**
   * Use role="alertdialog" for confirmations that interrupt the user (e.g. "Delete 3 orders?").
   * Screen readers announce these more assertively.
   */
  role?: "dialog" | "alertdialog";
  className?: string;
}

let openDialogCount = 0;

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
  initialFocusRef,
  role = "dialog",
  className
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  // Focus management: move focus in on open, restore it to the trigger on close.
  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (dialog) {
      const target =
        initialFocusRef?.current ??
        getFocusable(dialog).find((el) => !el.classList.contains("fp-dialog__close")) ??
        dialog;
      target.focus();
    }
    return () => {
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus();
    };
  }, [open, initialFocusRef]);

  // Lock page scroll while any dialog is open (supports nested dialogs).
  useEffect(() => {
    if (!open) return undefined;
    openDialogCount += 1;
    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (openDialogCount === 1) {
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      openDialogCount -= 1;
      if (openDialogCount === 0) {
        document.body.style.overflow = overflow;
        document.body.style.paddingRight = paddingRight;
      }
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onOpenChangeRef.current(false);
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    // Keep Tab / Shift+Tab cycling inside the dialog.
    const focusable = getFocusable(dialogRef.current);
    if (focusable.length === 0) {
      event.preventDefault();
      dialogRef.current.focus();
      return;
    }
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === dialogRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      className="fp-dialog-overlay"
      onMouseDown={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) onOpenChangeRef.current(false);
      }}
    >
      <div
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cx("fp-dialog", size !== "md" && `fp-dialog--${size}`, className)}
        onKeyDown={onKeyDown}
      >
        <div className="fp-dialog__header">
          <div>
            <h2 id={titleId} className="fp-dialog__title">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="fp-dialog__description">
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              className="fp-dialog__close"
              aria-label="Close"
              onClick={() => onOpenChangeRef.current(false)}
            >
              <CloseIcon />
            </button>
          )}
        </div>
        {children && <div className="fp-dialog__body">{children}</div>}
        {footer && <div className="fp-dialog__footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
