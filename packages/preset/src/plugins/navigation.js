import fs from 'node:fs';
import path from 'node:path';

const DOCS_PLUGIN = 'docusaurus-plugin-content-docs';

function categoryMetadata(version, directory, siteDir) {
  const file = [
    version.contentPathLocalized,
    version.contentPath ?? path.join(siteDir, 'documents'),
  ]
    .filter(Boolean)
    .map((root) => path.join(root, directory, '_category_.json'))
    .find((candidate) => fs.existsSync(candidate));
  return file ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

// Collect public docs from Docusaurus; never read a second content repository.
export function buildNavigation(
  instances,
  siteDir,
  {normalizePath, documentDates, documentLocation},
) {
  const root = {directories: new Map(), documents: []};
  const paths = [];
  const documentEntries = [];
  for (const data of Object.values(instances)) {
    for (const version of data.loadedVersions || []) {
      for (const doc of version.docs || []) {
        if (doc.draft || doc.unlisted) continue;
        paths.push(normalizePath(doc.permalink));
        const {
          segments,
          directory: documentDirectory,
          isIndex,
        } = documentLocation(doc.source, doc.sourceDirName);
        const {updated} = documentDates(doc.frontMatter);
        documentEntries.push({
          title: doc.title,
          href: doc.permalink,
          directory: documentDirectory,
          isIndex,
          updated: updated ?? '',
        });
        let parent = root;
        let directory = '';
        for (const segment of segments) {
          directory = directory ? `${directory}/${segment}` : segment;
          if (!parent.directories.has(segment)) {
            const metadata = categoryMetadata(version, directory, siteDir);
            parent.directories.set(segment, {
              label: metadata.label || segment,
              position: metadata.position ?? Infinity,
              directories: new Map(),
              documents: [],
            });
          }
          parent = parent.directories.get(segment);
        }
        parent.documents.push({
          type: 'link',
          label: doc.title,
          href: doc.permalink,
          position: isIndex ? -1 : (doc.frontMatter?.sidebar_position ?? Infinity),
        });
      }
    }
  }
  const compare = (a, b) =>
    a.position - b.position || a.label.localeCompare(b.label, 'en', {numeric: true});
  function items(node) {
    return [
      ...node.documents,
      ...Array.from(node.directories.values()).map((child) => ({
        type: 'category',
        label: child.label,
        position: child.position,
        collapsible: true,
        collapsed: true,
        items: items(child),
      })),
    ]
      .sort(compare)
      .map(({position, ...item}) => item);
  }
  function categoryLabels(node, parent = '') {
    return Object.fromEntries(
      [...node.directories].flatMap(([name, child]) => {
        const directory = parent ? `${parent}/${name}` : name;
        return [[directory, child.label], ...Object.entries(categoryLabels(child, directory))];
      }),
    );
  }
  return {sidebar: items(root), paths, documentEntries, categoryLabels: categoryLabels(root)};
}

export default function libraryNavigation(context, options) {
  if (
    !options ||
    ![options.normalizePath, options.documentDates, options.documentLocation].every(
      (value) => typeof value === 'function',
    )
  ) {
    throw new TypeError(
      'Navigation requires normalizePath, documentDates and documentLocation options.',
    );
  }
  return {
    name: 'library-navigation',
    allContentLoaded({allContent, actions}) {
      actions.setGlobalData(
        buildNavigation(allContent[DOCS_PLUGIN] || {}, context.siteDir, options),
      );
    },
  };
}
