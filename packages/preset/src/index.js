import {createRequire} from 'node:module';
import classicPreset from '@docusaurus/preset-classic';
import {normalizePath, documentDates, documentLocation} from '@dino-ovum/theme/utils';
import {resolveOptions} from './options.js';
import navigation from './plugins/navigation.js';
import recentUpdates from './plugins/recent-updates.js';
import generatedModuleCompat from './plugins/generated-module-compat.js';
import manifestPlugin from './plugins/manifest.js';

const require = createRequire(import.meta.url);
const classicRequire = createRequire(require.resolve('@docusaurus/preset-classic'));
const classicThemeRequire = createRequire(classicRequire.resolve('@docusaurus/theme-classic'));

// pnpm can instantiate the same Docusaurus version with different optional
// peer sets. React context providers and consumers must share one module.
function sharedClientContexts() {
  return {
    name: 'dino-ovum-client-contexts',
    configureWebpack() {
      return {
        resolve: {
          alias: {
            '@docusaurus/theme-common$': classicThemeRequire.resolve('@docusaurus/theme-common'),
            '@docusaurus/theme-common/internal$': classicThemeRequire.resolve(
              '@docusaurus/theme-common/internal',
            ),
            '@docusaurus/theme-common/Details$': classicThemeRequire.resolve(
              '@docusaurus/theme-common/Details',
            ),
            '@docusaurus/plugin-content-docs/client$': classicRequire.resolve(
              '@docusaurus/plugin-content-docs/client',
            ),
          },
        },
      };
    },
  };
}

export default function dinoPreset(context, presetOptions = {}) {
  const options = resolveOptions(presetOptions);
  const classic = (classicPreset.default ?? classicPreset)(context, {
    docs: options.documents,
    blog: false,
    sitemap: false,
  });
  return {
    plugins: [
      ...classic.plugins,
      require.resolve('docusaurus-plugin-sass'),
      generatedModuleCompat,
      sharedClientContexts,
      [navigation, {normalizePath, documentDates, documentLocation}],
      [
        recentUpdates,
        {documentDates, labels: {default: context.siteConfig.title}, page: options.updates},
      ],
      ...(options.pwa
        ? [
            [
              manifestPlugin,
              {manifest: typeof options.pwa === 'object' ? (options.pwa.manifest ?? {}) : {}},
            ],
            [
              require.resolve('@docusaurus/plugin-pwa'),
              {
                offlineModeActivationStrategies: ['always'],
                ...(typeof options.pwa === 'object'
                  ? Object.fromEntries(
                      Object.entries(options.pwa).filter(([key]) => key !== 'manifest'),
                    )
                  : {}),
              },
            ],
          ]
        : []),
    ],
    themes: [
      ...classic.themes,
      require.resolve('@docusaurus/theme-mermaid'),
      ...(options.search
        ? [
            [
              require.resolve('@easyops-cn/docusaurus-search-local'),
              {
                hashed: true,
                language: context.siteConfig.i18n.locales,
                indexBlog: false,
                docsRouteBasePath: [options.documents.routeBasePath],
                docsDir: [options.documents.path],
                highlightSearchTermsOnTargetPage: true,
                ...(typeof options.search === 'object' ? options.search : {}),
              },
            ],
          ]
        : []),
      [require.resolve('@dino-ovum/theme'), {customCss: options.customCss}],
    ],
  };
}
