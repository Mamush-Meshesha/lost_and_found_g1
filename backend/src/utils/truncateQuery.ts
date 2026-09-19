export function truncateQuery(query: string, maxLength: number): string {
  const trimmed = query.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength);
}
