import path from 'node:path';

// Docusaurus uses category labels as translation keys by default. Scope them
// to their directory so names such as "database" can appear in several branches.
export default async function sidebarItemsGenerator(args) {
  const items = await args.defaultSidebarItemsGenerator(args);
  function scopeCategories(entries, parent) {
    return entries.map((item) => {
      if (item.type !== 'category') return item;
      const directory = path.posix.join(parent, item.source ?? item.label);
      return {
        ...item,
        key: item.key ?? directory,
        items: scopeCategories(item.items, directory),
      };
    });
  }
  return scopeCategories(items, args.item.dirName);
}
