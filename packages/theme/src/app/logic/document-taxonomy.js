export function documentTaxonomy(directory) {
  const parts = directory.split('/').filter(Boolean);
  const category = parts[0] || 'Documents';
  const topic = parts.slice(1).join(' / ') || category;
  const tone = Array.from(directory).reduce(
    (value, char) => (value * 31 + char.charCodeAt(0)) % 6,
    0,
  );
  return {category, topic, tone};
}
