import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../utils/cx";
import { CloseIcon } from "../../utils/icons";

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Milliseconds before auto-dismiss. `Infinity` keeps it until dismissed. Default 5000. */
  duration?: number;
  /** Optional action, e.g. an "Undo" button. */
  action?: ReactNode;
}

type ToastItem = Omit<ToastOptions, "tone" | "duration"> & {
  id: number;
  tone: ToastTone;
  duration: number;
};

interface ToastContextValue {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Access `toast()` and `dismiss()`. Must be used inside <ToastProvider>. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>.");
  return context;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Maximum toasts shown at once; older ones are removed first. Default 3. */
  limit?: number;
  /** Accessible name of the notifications region. */
  label?: string;
}

let nextId = 1;

export function ToastProvider({ children, limit = 3, label = "Notifications" }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    ({ tone = "info", duration = 5000, ...options }: ToastOptions) => {
      const id = nextId++;
      setToasts((current) => [...current, { id, tone, duration, ...options }].slice(-limit));
      return id;
    },
    [limit]
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          // The region stays mounted so screen readers pick up new toasts as they're added.
          <section aria-label={label} className="fp-toast-region-wrapper">
            <div className="fp-toast-region">
              {toasts.map((item) => (
                <ToastCard key={item.id} item={item} onDismiss={dismiss} />
              ))}
            </div>
          </section>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(item.duration);
  const startedAt = useRef(0);

  // Auto-dismiss, pausing while hovered or focused so people have time to read or act.
  useEffect(() => {
    if (paused || !Number.isFinite(remaining.current)) return undefined;
    startedAt.current = Date.now();
    const timeoutId = window.setTimeout(() => onDismiss(item.id), remaining.current);
    return () => {
      window.clearTimeout(timeoutId);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, item.id, onDismiss]);

  return (
    <div
      // Errors interrupt (assertive); everything else waits for a pause (polite).
      role={item.tone === "danger" ? "alert" : "status"}
      aria-atomic="true"
      className={cx("fp-toast", `fp-toast--${item.tone}`)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <span className="fp-toast__indicator" aria-hidden="true" />
      <div>
        <p className="fp-toast__title">{item.title}</p>
        {item.description && <p className="fp-toast__description">{item.description}</p>}
        {item.action && <div className="fp-toast__action">{item.action}</div>}
      </div>
      <button type="button" className="fp-toast__close" aria-label="Dismiss notification" onClick={() => onDismiss(item.id)}>
        <CloseIcon />
      </button>
    </div>
  );
}
