import {mkdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));

// The two published packages always share one version.
export function currentVersion(root = projectRoot) {
  const [themeVersion, presetVersion] = ['theme', 'preset'].map(
    (name) =>
      JSON.parse(readFileSync(path.join(root, 'packages', name, 'package.json'), 'utf8')).version,
  );
  if (themeVersion !== presetVersion)
    throw new Error(`Package versions differ: theme ${themeVersion}, preset ${presetVersion}`);
  return themeVersion;
}

export function packPackages(
  sourceRoot = projectRoot,
  destination = path.join(projectRoot, 'artifacts'),
) {
  mkdirSync(destination, {recursive: true});
  const archives = {};
  for (const name of ['theme', 'preset']) {
    const directory = path.join(sourceRoot, 'packages', name);
    const manifest = JSON.parse(readFileSync(path.join(directory, 'package.json'), 'utf8'));
    execFileSync('pnpm', ['pack', '--pack-destination', destination], {
      cwd: directory,
      stdio: 'pipe',
    });
    archives[name] = path.join(destination, `dino-ovum-${name}-${manifest.version}.tgz`);
    console.log(`Packed ${archives[name]}`);
  }
  return archives;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url)
  packPackages();
