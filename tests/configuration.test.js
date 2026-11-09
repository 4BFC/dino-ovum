import assert from 'node:assert/strict';
import {test} from 'node:test';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {createDinoConfig} from '../packages/preset/src/config.js';
import {resolveOptions} from '../packages/preset/src/options.js';
import dinoTheme from '../packages/theme/src/index.js';
import {createManifest, assetUrl} from '../packages/preset/src/plugins/manifest.js';

test('site customization replaces menus without losing defaults or mutating inputs', () => {
  const site = {
    title: 'My notebook',
    url: 'https://example.org',
    baseUrl: '/notes/',
    plugins: ['my-plugin'],
    themes: ['my-theme'],
    presets: ['my-preset'],
    i18n: {defaultLocale: 'ko', locales: ['ko'], localeConfigs: {ko: {label: '내 문서'}}},
    themeConfig: {
      navbar: {items: [{to: '/about', label: 'About'}]},
      colorMode: {defaultMode: 'dark'},
    },
  };
  const before = structuredClone(site);
  const config = createDinoConfig(site, {documents: {path: 'notes'}, updates: true});
  assert.deepEqual(site, before);
  assert.equal(config.themeConfig.navbar.title, site.title);
  assert.equal(config.future.faster, false);
  assert.deepEqual(config.themeConfig.navbar.items, site.themeConfig.navbar.items);
  assert.equal(config.themeConfig.colorMode.defaultMode, 'dark');
  assert.equal(config.themeConfig.colorMode.respectPrefersColorScheme, false);
  assert.deepEqual(config.i18n.locales, ['ko']);
  assert.equal(config.i18n.path, 'notes/_translations');
  assert.equal(config.i18n.localeConfigs.ko.label, '내 문서');
  assert.deepEqual(Object.keys(config.i18n.localeConfigs), ['ko']);
  assert.deepEqual(config.plugins, ['my-plugin']);
  assert.deepEqual(config.themes, ['my-theme']);
  assert.equal(config.presets[1], 'my-preset');
});

test('optional features are explicit and invalid options fail before building', () => {
  const defaults = resolveOptions();
  assert.equal(defaults.pwa, false);
  assert.equal(defaults.updates, false);
  assert.equal(defaults.search, true);
  assert.ok(existsSync(defaults.documents.sidebarPath));
  for (const invalid of [
    {documents: []},
    {documents: {id: 'other'}},
    {customCss: [42]},
    {updates: 'yes'},
    {search: null},
    {pwa: []},
    {unknown: true},
  ]) {
    assert.throws(() => resolveOptions(invalid), TypeError);
  }
  assert.throws(() => createDinoConfig({title: 'Missing URL'}), /title and URL/);
  const config = createDinoConfig({
    title: 'Notes',
    url: 'https://example.org',
    i18n: {locales: ['en']},
  });
  assert.ok(!config.themeConfig.navbar.items.some((item) => item.type === 'custom-recentUpdates'));
  assert.ok(
    !config.themeConfig.navbar.items.some((item) => item.type === 'custom-languageDropdown'),
  );
});

test('theme resolves its own assets and appends site CSS after shared styles', () => {
  const theme = dinoTheme(
    {siteDir: '/tmp/user-site', i18n: {currentLocale: 'ko'}},
    {customCss: ['src/custom.css']},
  );
  const modules = theme.getClientModules();
  assert.ok(existsSync(theme.getThemePath()));
  assert.ok(existsSync(modules[0]));
  assert.equal(modules.at(-1), path.resolve('/tmp/user-site/src/custom.css'));
  assert.equal(theme.getDefaultCodeTranslationMessages()['docnest.language.label'], '언어 변경');
  assert.deepEqual(
    dinoTheme({i18n: {currentLocale: 'en'}}).getDefaultCodeTranslationMessages(),
    {},
  );
});

test('PWA paths follow the locale and subpath while preserving external assets', () => {
  const manifest = createManifest(
    {
      baseUrl: '/notes/ko/',
      i18n: {currentLocale: 'ko'},
      siteConfig: {title: 'My notebook', tagline: 'Personal notes', baseUrl: '/notes/'},
    },
    {
      short_name: 'Notes',
      icons: [
        {src: 'img/logo.svg', sizes: 'any'},
        {src: '/notes/ko/img/large.png'},
        {src: 'https://cdn.example.org/logo.png'},
      ],
    },
  );
  assert.equal(manifest.start_url, '/notes/ko/');
  assert.equal(manifest.scope, '/notes/ko/');
  assert.equal(manifest.name, 'My notebook');
  assert.equal(manifest.short_name, 'Notes');
  assert.equal(manifest.lang, 'ko');
  assert.deepEqual(
    manifest.icons.map((icon) => icon.src),
    ['/notes/ko/img/logo.svg', '/notes/ko/img/large.png', 'https://cdn.example.org/logo.png'],
  );
  assert.equal(assetUrl('img/logo.svg', '/'), '/img/logo.svg');
});
