import { useCallback, useRef, useState } from "react";

interface Options<T> {
  value: T | undefined;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/**
 * State that can be controlled (value + onChange) or uncontrolled (defaultValue),
 * the same way native form inputs work.
 */
export function useControllableState<T>({ value, defaultValue, onChange }: Options<T>) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled]
  );

  return [current, setValue] as const;
}
