import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {packPackages, projectRoot} from './pack.js';

const temporaryRoot = mkdtempSync(path.join(os.tmpdir(), 'dino-ovum-packages-'));
const siteDir = path.join(temporaryRoot, 'site');
const archives = packPackages();

function writeJson(filename, value) {
  writeFileSync(filename, JSON.stringify(value, null, 2) + '\n');
}

function run(argumentsList) {
  execFileSync('pnpm', argumentsList, {
    cwd: siteDir,
    stdio: 'inherit',
    env: {...process.env, CI: 'true'},
  });
}

function install(packageArchives) {
  const filename = path.join(siteDir, 'package.json');
  const manifest = JSON.parse(readFileSync(filename, 'utf8'));
  manifest.dependencies['@dino-ovum/preset'] = `file:${packageArchives.preset}`;
  // Local publishing simulation: the preset tarball uses a real registry version,
  // which is redirected to the matching theme archive until npm publication.
  manifest.pnpm = {overrides: {'@dino-ovum/theme': `file:${packageArchives.theme}`}};
  writeJson(filename, manifest);
  run(['install', '--prefer-offline', '--ignore-scripts', '--no-frozen-lockfile']);
  run(['clear']);
}

function page(relativePath) {
  const stem = path.join(siteDir, 'build', relativePath);
  const filename = [path.join(stem, 'index.html'), `${stem}.html`].find(existsSync);
  assert.ok(filename, `Missing built page: ${relativePath}`);
  return readFileSync(filename, 'utf8');
}

function fingerprint(filename) {
  return createHash('sha256')
    .update(readFileSync(path.join(siteDir, filename)))
    .digest('hex');
}

try {
  for (const [name, archive] of Object.entries(archives)) {
    const files = execFileSync('tar', ['-tzf', archive], {encoding: 'utf8'}).split('\n');
    for (const required of [
      'package/package.json',
      'package/LICENSE',
      'package/README.md',
    ])
      assert.ok(files.includes(required));
    assert.ok(
      !files.some(
        (filename) => filename.includes('/node_modules/') || filename.includes('/website/'),
      ),
    );
    if (name === 'theme') {
      assert.ok(files.includes('package/src/assets/fonts/pretendard/PretendardStd-Bold.woff2'));
      assert.ok(files.includes('package/src/assets/fonts/pretendard/LICENSE'));
      assert.ok(files.includes('package/src/translations/ko.json'));
      assert.ok(files.includes('package/src/translations/ja.json'));
    } else {
      const manifest = JSON.parse(
        execFileSync('tar', ['-xOzf', archive, 'package/package.json'], {encoding: 'utf8'}),
      );
      assert.equal(manifest.dependencies['@dino-ovum/theme'], '0.1.0');
    }
  }
  cpSync(path.join(projectRoot, 'website'), siteDir, {
    recursive: true,
    filter: (source) =>
      !['node_modules', 'build', '.docusaurus', '.docusaurus-dev'].includes(path.basename(source)),
  });
  const configurationPath = path.join(siteDir, 'docusaurus.config.js');
  writeFileSync(
    configurationPath,
    readFileSync(configurationPath, 'utf8')
      .replace("title: 'Dino Ovum'", "title: 'My private notebook'")
      .replace("baseUrl: '/'", "baseUrl: '/handbook/'"),
  );
  writeFileSync(
    path.join(siteDir, 'documents/custom.md'),
    '---\ntitle: Custom document\nslug: /custom\n---\n\nMy content survives package updates.\n',
  );
  const stylesheet = path.join(siteDir, 'src/css/custom.css');
  writeFileSync(
    stylesheet,
    readFileSync(stylesheet, 'utf8') + '\n:root { --user-package-fixture: 731px; }\n',
  );
  const overrideDirectory = path.join(siteDir, 'src/theme/DinoOvum');
  mkdirSync(overrideDirectory, {recursive: true});
  writeFileSync(
    path.join(overrideDirectory, 'HomeHeading.jsx'),
    'import OriginalHomeHeading from \'@theme-original/DinoOvum/HomeHeading\';\nexport default function HomeHeading() { return <div data-user-override="preserved"><OriginalHomeHeading /></div>; }\n',
  );
  writeJson(path.join(siteDir, 'documents/_translations/ko/code.json'), {
    'docnest.language.label': {message: '사용자 언어 선택'},
  });
  const ownedFiles = [
    'documents/custom.md',
    'src/css/custom.css',
    'src/theme/DinoOvum/HomeHeading.jsx',
    'documents/_translations/ko/code.json',
    'public/img/icon-light.svg',
    'docusaurus.config.js',
  ];
  const fingerprints = Object.fromEntries(
    ownedFiles.map((filename) => [filename, fingerprint(filename)]),
  );
  install(archives);
  run(['build']);
  const home = page('');
  assert.ok(home.includes('My private notebook'));
  assert.ok(home.includes('data-user-override="preserved"'));
  assert.ok(page('custom').includes('My content survives package updates.'));
  assert.ok(page('ko').includes('사용자 언어 선택'));
  assert.ok(page('ja').includes('言語'));
  for (const locale of ['', 'ko', 'ja']) {
    page(path.join(locale, 'updates'));
    const output = path.join(siteDir, 'build', locale);
    const manifest = JSON.parse(readFileSync(path.join(output, 'manifest.json'), 'utf8'));
    const baseUrl = `/handbook/${locale ? `${locale}/` : ''}`;
    assert.equal(manifest.scope, baseUrl);
    assert.equal(manifest.start_url, baseUrl);
    assert.ok(existsSync(path.join(output, 'sw.js')));
    assert.ok(readdirSync(output).some((filename) => /^search-index.*\.json$/.test(filename)));
    assert.ok(page(locale).includes(`${baseUrl}manifest.json`));
    const iconPath = manifest.icons[0].src.replace(/^\/handbook\//, '');
    assert.ok(
      existsSync(path.join(siteDir, 'build', iconPath)),
      `Missing PWA icon: ${manifest.icons[0].src}`,
    );
  }
  const css = readdirSync(path.join(siteDir, 'build/assets/css'))
    .map((filename) => readFileSync(path.join(siteDir, 'build/assets/css', filename), 'utf8'))
    .join('\n');
  assert.ok(css.includes('--user-package-fixture:731px'));
  console.log(
    'Isolated archives: three locales, search, PWA, subpath, CSS, translation, and component override verified.',
  );

  const upgradeRoot = path.join(temporaryRoot, 'upgrade');
  cpSync(path.join(projectRoot, 'packages'), path.join(upgradeRoot, 'packages'), {
    recursive: true,
    filter: (source) => path.basename(source) !== 'node_modules',
  });
  for (const name of ['theme', 'preset']) {
    const filename = path.join(upgradeRoot, 'packages', name, 'package.json');
    const manifest = JSON.parse(readFileSync(filename, 'utf8'));
    manifest.version = '0.1.1';
    if (name === 'preset') manifest.dependencies['@dino-ovum/theme'] = '0.1.1';
    writeJson(filename, manifest);
  }
  const heading = path.join(upgradeRoot, 'packages/theme/src/app/components/HomeHeading.jsx');
  writeFileSync(
    heading,
    readFileSync(heading, 'utf8').replace(
      '<h1>{title}</h1>',
      '<h1>{title}</h1><span>Package upgrade verified</span>',
    ),
  );
  const upgradeArchives = packPackages(upgradeRoot, path.join(temporaryRoot, 'archives'));
  install(upgradeArchives);
  run(['build', '--locale', 'en']);
  assert.ok(page('').includes('Package upgrade verified'));
  assert.ok(page('').includes('data-user-override="preserved"'));
  for (const filename of ownedFiles)
    assert.equal(fingerprint(filename), fingerprints[filename], `User file changed: ${filename}`);
  console.log(
    'Package upgrade verified: shared UI changed; user content, config, logo, CSS, translations, and wrapper are unchanged.',
  );
} finally {
  if (process.env.DINO_OVUM_KEEP_VERIFICATION === '1')
    console.log(`Verification site kept at ${siteDir}`);
  else rmSync(temporaryRoot, {recursive: true, force: true});
}
