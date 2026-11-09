// Shared frontmatter policy for build-time document collectors.
function toDay(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  }
  if (typeof value !== 'string') return null;

  // Preserve the written date of a string; do not shift it through local time.
  const day = value.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  if (!day) return null;
  const date = new Date(`${day}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === day ? day : null;
}

export function documentDates(frontMatter) {
  const created = toDay(frontMatter?.created_at) || toDay(frontMatter?.date);
  const updated = toDay(frontMatter?.updated_at) || toDay(frontMatter?.updated) || created;
  return {created, updated};
}
