type ClassValue = string | false | null | undefined;

/** Joins truthy class names. */
export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
