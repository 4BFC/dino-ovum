import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export default function dinoTheme(context, options = {}) {
  const sourceDirectory = fileURLToPath(new URL('./', import.meta.url));
  return {
    name: 'dino-ovum-theme',
    configureWebpack(_configuration, isServer, {getJSLoader}) {
      // Docusaurus 3.10.1 only transpiles dependencies with "docusaurus" in
      // their name. Workspace sources already use its normal JS rule.
      if (!sourceDirectory.split(path.sep).includes('node_modules')) return {};
      return {
        module: {
          rules: [
            {
              test: /\.[jt]sx?$/i,
              include: sourceDirectory,
              use: [getJSLoader({isServer})],
            },
          ],
        },
      };
    },
    getThemePath() {
      return fileURLToPath(new URL('./theme', import.meta.url));
    },
    getClientModules() {
      const customCss = options.customCss ?? [];
      return [
        fileURLToPath(new URL('./app/styles/custom.scss', import.meta.url)),
        ...(Array.isArray(customCss) ? customCss : [customCss]).map((filename) =>
          path.resolve(context.siteDir, filename),
        ),
      ];
    },
    getDefaultCodeTranslationMessages() {
      const locale = context.i18n.currentLocale.split('-')[0];
      if (!['ko', 'ja'].includes(locale)) return {};
      const translations = JSON.parse(
        readFileSync(new URL(`./translations/${locale}.json`, import.meta.url), 'utf8'),
      );
      return Object.fromEntries(
        Object.entries(translations).map(([key, value]) => [key, value.message]),
      );
    },
  };
}
