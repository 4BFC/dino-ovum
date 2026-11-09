import {writeFile} from 'node:fs/promises';
import path from 'node:path';

export function assetUrl(filename, baseUrl) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(filename)) return filename;
  if (filename.startsWith(baseUrl)) return filename;
  return `${baseUrl}${filename.replace(/^\/+/, '')}`;
}

export function createManifest(context, overrides = {}) {
  const {siteConfig, i18n, baseUrl} = context;
  return {
    name: siteConfig.title,
    short_name: siteConfig.title,
    description: siteConfig.tagline ?? '',
    lang: i18n.currentLocale,
    start_url: baseUrl,
    scope: baseUrl,
    display: 'standalone',
    background_color: '#f8f9fa',
    theme_color: '#333333',
    ...overrides,
    icons: (overrides.icons ?? []).map((icon) => ({
      ...icon,
      src: assetUrl(icon.src, baseUrl),
    })),
  };
}

export default function manifestPlugin(context, options = {}) {
  const manifest = createManifest(context, options.manifest);
  return {
    name: 'dino-ovum-manifest',
    injectHtmlTags() {
      return {
        headTags: [
          {tagName: 'link', attributes: {rel: 'manifest', href: `${context.baseUrl}manifest.json`}},
          {tagName: 'meta', attributes: {name: 'theme-color', content: manifest.theme_color}},
        ],
      };
    },
    async postBuild({outDir}) {
      await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    },
  };
}
