import {isSameRoute} from '../routes.js';

export function findDocumentByRoute(documents, pathname) {
  return documents.find((doc) => isSameRoute(doc.href, pathname));
}

export function directoryDocuments(documents, directory, currentPath) {
  return documents
    .filter(
      (doc) =>
        (!directory || doc.directory === directory || doc.directory.startsWith(`${directory}/`)) &&
        !isSameRoute(doc.href, currentPath),
    )
    .sort((a, b) => a.title.localeCompare(b.title, 'ko', {numeric: true}));
}
