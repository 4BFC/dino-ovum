export function groupUpdates(entries, {instance, newOnly, days}, now) {
  // 기준일을 UTC 자정으로 고정한다 - frontmatter 날짜에 시간이 없어서 시차로 하루가 밀리면 안 된다
  const since = days === 0 ? null : new Date(now - days * 86400000).toISOString().slice(0, 10);

  const filtered = entries.filter(
    (e) =>
      (instance === 'All' || e.instance === instance) &&
      (!newOnly || e.isNew) &&
      (!since || (e.updated || e.created) >= since),
  );
  const byDay = new Map();
  for (const e of filtered) {
    const day = e.updated || e.created;
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(e);
  }
  return Array.from(byDay.entries());
}
