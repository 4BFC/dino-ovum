import {fileURLToPath} from 'node:url';
import {themes as prismThemes} from 'prism-react-renderer';
import {resolveOptions} from './options.js';

function isRecord(value) {
  return (
    value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype
  );
}

// Arrays replace defaults; objects merge. Inputs are never mutated.
export function mergeConfig(defaults, overrides) {
  const result = {...defaults};
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) continue;
    result[key] =
      isRecord(value) && isRecord(defaults[key]) ? mergeConfig(defaults[key], value) : value;
  }
  return result;
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// activeBaseRegex is tested against the full pathname, which carries the
// baseUrl and, outside the default locale, a locale segment.
export function createHomeActiveRegex({baseUrl, home, localePrefixes}) {
  const base = escapeRegex(`/${baseUrl.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/'));
  const locale = localePrefixes.length
    ? `(?:(?:${localePrefixes.map(escapeRegex).join('|')})/)?`
    : '';
  const homePath = home.replace(/^\/+|\/+$/g, '');
  return `^${base}${locale}${homePath ? `${escapeRegex(homePath)}/?` : ''}$`;
}

export function createDinoConfig(siteConfig, presetOptions = {}) {
  if (!siteConfig?.title || !siteConfig?.url) {
    throw new TypeError('createDinoConfig requires a site title and URL.');
  }
  const options = resolveOptions(presetOptions);
  const locales = siteConfig.i18n?.locales ?? ['en', 'ko', 'ja'];
  const knownLocales = {
    en: {label: 'English', htmlLang: 'en'},
    ko: {label: '한국어', htmlLang: 'ko'},
    ja: {label: '日本語', htmlLang: 'ja'},
  };
  const home = `/${options.documents.routeBasePath.replace(/^\/+|\/+$/g, '')}`;
  const defaultLocale = siteConfig.i18n?.defaultLocale ?? locales[0];
  const homeActiveRegex = createHomeActiveRegex({
    baseUrl: siteConfig.baseUrl ?? '/',
    home,
    localePrefixes: locales.filter((locale) => locale !== defaultLocale),
  });
  const defaults = {
    baseUrl: '/',
    staticDirectories: ['public'],
    // v4 enables Faster implicitly; keep it opt-in so consumers do not need
    // the optional native bundler package just to use this preset.
    future: {v4: true, faster: false},
    storage: {type: 'localStorage', namespace: 'dino-ovum'},
    onBrokenLinks: 'throw',
    onDuplicateRoutes: 'throw',
    markdown: {format: 'detect', mermaid: true},
    i18n: {
      defaultLocale: locales[0],
      locales,
      path: `${options.documents.path}/_translations`,
      localeConfigs: Object.fromEntries(
        locales.map((locale) => [locale, knownLocales[locale] ?? {}]),
      ),
    },
    themeConfig: {
      colorMode: {defaultMode: 'light', respectPrefersColorScheme: false},
      navbar: {
        title: siteConfig.title,
        items: [
          {type: 'custom-sidebarToggle', position: 'left'},
          {
            to: home,
            label: 'Home',
            position: 'right',
            activeBaseRegex: homeActiveRegex,
          },
          ...(options.updates ? [{type: 'custom-recentUpdates', position: 'right'}] : []),
          ...(locales.length > 1 ? [{type: 'custom-languageDropdown', position: 'right'}] : []),
        ],
      },
      prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
    },
  };
  const config = mergeConfig(defaults, siteConfig);
  config.presets = [
    [fileURLToPath(new URL('./index.js', import.meta.url)), presetOptions],
    ...(siteConfig.presets ?? []),
  ];
  return config;
}
