import {
  createContext,
  useContext,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";

interface TabsContextValue {
  baseId: string;
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string) {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`<${component}> must be used inside <Tabs>.`);
  return context;
}

const idFor = (baseId: string, kind: "tab" | "panel", value: string) =>
  `${baseId}-${kind}-${value.replace(/\s+/g, "-")}`;

export interface TabsProps {
  /** Selected tab (controlled). */
  value?: string;
  /** Initially selected tab (uncontrolled). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}

export function Tabs({ value, defaultValue = "", onValueChange, className, children }: TabsProps) {
  const baseId = useId();
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });

  return (
    <TabsContext.Provider value={{ baseId, value: current, setValue: setCurrent }}>
      <div className={cx("fp-tabs", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /** Describes the group of tabs for screen readers, e.g. "Order details". */
  "aria-label": string;
}

export function TabList({ className, children, onKeyDown, ...rest }: TabListProps) {
  const { setValue } = useTabsContext("TabList");
  const listRef = useRef<HTMLDivElement>(null);

  // Arrow keys move between tabs and select them; Home/End jump to the ends. Disabled tabs are skipped.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (!listRef.current || event.defaultPrevented) return;
    const tabs = Array.from(listRef.current.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;

    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    if (next === null) return;

    event.preventDefault();
    const target = tabs[next]!;
    target.focus();
    setValue(target.dataset.value ?? "");
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation="horizontal"
      className={cx("fp-tab-list", className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

export function Tab({ value, className, children, onClick, ...rest }: TabProps) {
  const { baseId, value: selected, setValue } = useTabsContext("Tab");
  const isSelected = selected === value;

  return (
    <button
      type="button"
      role="tab"
      id={idFor(baseId, "tab", value)}
      aria-selected={isSelected}
      aria-controls={idFor(baseId, "panel", value)}
      // Roving tabindex: only the selected tab is in the Tab order; arrows move within the list.
      tabIndex={isSelected ? 0 : -1}
      data-value={value}
      className={cx("fp-tab", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setValue(value);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabPanel({ value, className, children, ...rest }: TabPanelProps) {
  const { baseId, value: selected } = useTabsContext("TabPanel");
  if (selected !== value) return null;

  return (
    <div
      role="tabpanel"
      id={idFor(baseId, "panel", value)}
      aria-labelledby={idFor(baseId, "tab", value)}
      tabIndex={0}
      className={cx("fp-tab-panel", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
