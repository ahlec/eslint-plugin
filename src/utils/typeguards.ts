export function isIndexableObject(
  obj: unknown,
): obj is Record<string | number | symbol, unknown> {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}
