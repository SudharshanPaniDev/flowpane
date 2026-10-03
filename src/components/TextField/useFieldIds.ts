import { useId } from "react";

/** Stable ids for a field and its description/error, plus the aria-describedby value that links them. */
export function useFieldIds(id: string | undefined, hasDescription: boolean, hasError: boolean) {
  const generated = useId();
  const fieldId = id ?? `fp-field-${generated}`;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const describedBy = [hasDescription && descriptionId, hasError && errorId].filter(Boolean).join(" ") || undefined;
  return { fieldId, descriptionId, errorId, describedBy };
}
