import {fileURLToPath} from 'node:url';
import sidebarItemsGenerator from './sidebar-items.js';

export function resolveOptions(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Dino Ovum options must be an object.');
  }
  const supported = ['documents', 'customCss', 'search', 'pwa', 'updates'];
  for (const key of Object.keys(options)) {
    if (!supported.includes(key)) throw new TypeError(`Unknown Dino Ovum option: ${key}`);
  }
  if (
    options.documents !== undefined &&
    (!options.documents ||
      typeof options.documents !== 'object' ||
      Array.isArray(options.documents))
  ) {
    throw new TypeError('documents must configure one document root.');
  }
  if (options.documents?.id && options.documents.id !== 'default') {
    throw new TypeError('Dino Ovum 0.1 supports only the default document instance.');
  }
  for (const key of ['search', 'pwa']) {
    const value = options[key];
    if (
      value !== undefined &&
      typeof value !== 'boolean' &&
      (!value || typeof value !== 'object' || Array.isArray(value))
    ) {
      throw new TypeError(`${key} must be a boolean or an options object.`);
    }
  }
  if (options.updates !== undefined && typeof options.updates !== 'boolean') {
    throw new TypeError('updates must be a boolean.');
  }
  const customCss =
    options.customCss === undefined
      ? []
      : Array.isArray(options.customCss)
        ? options.customCss
        : [options.customCss];
  if (customCss.some((filename) => typeof filename !== 'string' || !filename)) {
    throw new TypeError('customCss must be a path or an array of paths.');
  }
  return {
    documents: {
      path: 'documents',
      routeBasePath: '/',
      sidebarPath: fileURLToPath(new URL('./sidebars.js', import.meta.url)),
      sidebarItemsGenerator,
      exclude: ['**/_*/**', '**/_*.{md,mdx}', '**/README.md', '**/AGENTS.md', '**/CLAUDE.md'],
      ...options.documents,
    },
    customCss,
    search: options.search ?? true,
    pwa: options.pwa ?? false,
    updates: options.updates ?? false,
  };
}
