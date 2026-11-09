import {findDocumentByRoute} from './document-list.js';
import {SITE_ROUTES, isSameRoute} from '../routes.js';

export function documentBreadcrumbs(documents, currentPath, categoryLabels = {}) {
  const current = findDocumentByRoute(documents, currentPath);
  if (
    !current ||
    isSameRoute(current.href, SITE_ROUTES.home) ||
    (current.isIndex && !current.directory)
  )
    return null;
  const items = [];
  const segments = current.directory.split('/').filter(Boolean);
  segments.forEach((label, index) => {
    const directory = segments.slice(0, index + 1).join('/');
    const overview = documents.find((doc) => doc.isIndex && doc.directory === directory);
    items.push({
      label: overview?.title || categoryLabels[directory] || label,
      href: overview?.href,
    });
  });
  if (!current.isIndex) items.push({label: current.title, href: current.href});
  return items;
}
