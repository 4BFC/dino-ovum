// Release version commands for .github/workflows/publish.yml.
//   node .github/scripts/version.js check v0.1.1  prints 0.1.1 when the tag is newer than the packages
//   node .github/scripts/version.js set 0.1.1     writes 0.1.1 to every version field
import {readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {currentVersion, projectRoot} from '../../scripts/pack.js';

const VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)$/;

// Every place that shows the released version. Each pattern must match exactly once.
export const VERSION_FIELDS = [
  {file: 'package.json', pattern: /("version":\s*")[^"]+(")/},
  {file: 'packages/preset/package.json', pattern: /("version":\s*")[^"]+(")/},
  {file: 'packages/theme/package.json', pattern: /("version":\s*")[^"]+(")/},
  {file: 'website/package.json', pattern: /("version":\s*")[^"]+(")/},
  {
    file: 'website/docusaurus.config.js',
    pattern: /(customFields:\s*\{[^}]*\bversion:\s*')[^']+(')/,
  },
];

export function parseVersion(version) {
  const match = VERSION_PATTERN.exec(version);
  if (!match) throw new Error(`Not a release version (major.minor.patch): ${version}`);
  return match.slice(1).map(Number);
}

export function compareVersions(left, right) {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  for (let index = 0; index < leftParts.length; index += 1) {
    if (leftParts[index] !== rightParts[index]) return leftParts[index] - rightParts[index];
  }
  return 0;
}

export function releaseVersionFromTag(tag, root = projectRoot) {
  if (!tag?.startsWith('v')) throw new Error(`Release tag must look like v1.2.3: ${tag}`);
  const version = tag.slice(1);
  const current = currentVersion(root);
  if (compareVersions(version, current) <= 0)
    throw new Error(`Release ${version} must be newer than the current version ${current}`);
  return version;
}

export function setVersion(version, root = projectRoot) {
  parseVersion(version);
  for (const {file, pattern} of VERSION_FIELDS) {
    const filename = path.join(root, file);
    const source = readFileSync(filename, 'utf8');
    const matches = source.match(new RegExp(pattern.source, 'g')) ?? [];
    if (matches.length !== 1)
      throw new Error(`Expected one version field in ${file}, found ${matches.length}`);
    writeFileSync(filename, source.replace(pattern, `$1${version}$2`));
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const [command, value] = process.argv.slice(2);
  if (command === 'check') {
    console.log(releaseVersionFromTag(value));
  } else if (command === 'set') {
    setVersion(value);
    console.log(`Version set to ${value}`);
  } else {
    console.error('Usage: node .github/scripts/version.js check <tag> | set <version>');
    process.exit(1);
  }
}
