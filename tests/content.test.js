import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildNavigation} from '../packages/preset/src/plugins/navigation.js';
import recentUpdates from '../packages/preset/src/plugins/recent-updates.js';
import {normalizePath, documentDates, documentLocation} from '../packages/theme/src/utils.js';

test('navigation uses localized category metadata and custom document roots, excluding hidden content', () => {
  const siteDir = mkdtempSync(path.join(os.tmpdir(), 'dino-navigation-'));
  try {
    const contentPath = path.join(siteDir, 'notes');
    const contentPathLocalized = path.join(siteDir, 'translations/ko');
    for (const directory of [contentPath, contentPathLocalized])
      mkdirSync(path.join(directory, 'guides'), {recursive: true});
    writeFileSync(
      path.join(contentPath, 'guides/_category_.json'),
      JSON.stringify({label: 'Guides'}),
    );
    writeFileSync(
      path.join(contentPathLocalized, 'guides/_category_.json'),
      JSON.stringify({label: '안내', position: 1}),
    );
    const document = {
      title: '시작',
      permalink: '/notes/ko/guides/',
      source: '@site/notes/guides/index.mdx',
      sourceDirName: 'guides',
      frontMatter: {created_at: '2026-11-01', updated_at: '2026-11-10'},
    };
    const instances = {
      default: {
        loadedVersions: [
          {
            contentPath,
            contentPathLocalized,
            docs: [
              document,
              {...document, title: 'Private', permalink: '/secret', unlisted: true},
              {...document, title: 'Draft', permalink: '/draft', draft: true},
            ],
          },
        ],
      },
    };
    const data = buildNavigation(instances, siteDir, {
      normalizePath,
      documentDates,
      documentLocation,
    });
    assert.deepEqual(data.paths, ['/notes/ko/guides']);
    assert.equal(data.sidebar[0].label, '안내');
    assert.equal(data.documentEntries[0].directory, 'guides');
    assert.equal(data.documentEntries[0].isIndex, true);
    assert.equal(data.documentEntries[0].updated, '2026-11-10');
  } finally {
    rmSync(siteDir, {recursive: true, force: true});
  }
});

test('updates retain canonical permalinks, sort by date, and register only when enabled', async () => {
  const plugin = recentUpdates(
    {baseUrl: '/notes/ko/'},
    {documentDates, page: true, labels: {default: 'Notebook'}},
  );
  let route;
  let data;
  plugin.contentLoaded({
    actions: {
      addRoute(value) {
        route = value;
      },
    },
  });
  assert.equal(route.path, '/notes/ko/updates');
  await plugin.allContentLoaded({
    actions: {
      setGlobalData(value) {
        data = value;
      },
    },
    allContent: {
      'docusaurus-plugin-content-docs': {
        default: {
          loadedVersions: [
            {
              docs: [
                {title: 'Older', permalink: '/exact/older', frontMatter: {date: '2026-10-01'}},
                {
                  title: 'Newer',
                  permalink: '/exact/newer',
                  frontMatter: {created_at: '2026-10-02', updated_at: '2026-11-10'},
                },
                {
                  title: 'Hidden',
                  permalink: '/hidden',
                  unlisted: true,
                  frontMatter: {date: '2026-11-11'},
                },
              ],
            },
          ],
        },
      },
    },
  });
  assert.deepEqual(
    data.entries.map((entry) => entry.url),
    ['/exact/newer', '/exact/older'],
  );
  assert.equal(data.entries[0].instance, 'Notebook');
  recentUpdates({baseUrl: '/'}, {documentDates}).contentLoaded({
    actions: {
      addRoute() {
        assert.fail('Disabled route must not be registered');
      },
    },
  });
});

test('document dates reject impossible calendar dates and retain written timezone dates', () => {
  assert.deepEqual(documentDates({created_at: '2026-02-30'}), {created: null, updated: null});
  assert.deepEqual(documentDates({date: '2026-11-10T00:30:00+09:00'}), {
    created: '2026-11-10',
    updated: '2026-11-10',
  });
});
