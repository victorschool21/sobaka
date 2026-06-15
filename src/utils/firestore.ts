/** Firestore não aceita valores `undefined` — remove campos opcionais vazios. */
export function stripUndefined<T extends object>(data: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
}
