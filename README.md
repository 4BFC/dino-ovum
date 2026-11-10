<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/img/logo.png">
    <source media="(prefers-color-scheme: light)" srcset="./public/img/logo.png">
    <img alt="" src="./public/img/logo.png" width="96" height="96" align="bottom">
  </picture>&ensp;dino-ovum
</h1>

Shared Docusaurus presets and themes for dino-nest.

[![Unlicense](https://img.shields.io/badge/License-Unlicense-blue.svg?style=flat-square)](./LICENSE)
[![Standard Readme](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Keep your documents, branding, and settings in your own site. Dino Ovum brings shared
features and design to dino-nest through the preset and theme packages.

<div align="center">
<table align="center">
  <tr>
    <td align="center"><a href="language/eng/README.md"><img src="https://img.shields.io/badge/English-0969DA?style=flat-square" alt="English"></a></td>
    <td align="center"><a href="language/ko/README.md"><img src="https://img.shields.io/badge/%ED%95%9C%EA%B5%AD%EC%96%B4-555555?style=flat-square" alt="한국어"></a></td>
    <td align="center"><a href="language/jp/README.md"><img src="https://img.shields.io/badge/%E6%97%A5%E6%9C%AC%E8%AA%9E-555555?style=flat-square" alt="日本語"></a></td>
  </tr>
</table>
</div>

Design and implementation documents are maintained in Korean in `docs/`.

## Table of Contents

- [Specifications](#specifications)
- [Install](#install)
- [Usage](#usage)
- [Features](#features)
- [Maintainer](#maintainer)
- [Contributing](#contributing)
- [License](#license)

## Specifications

Dino Ovum 0.1.0 contains two packages:

| Component | Package | Description |
| --- | --- | --- |
| ![Dino Ovum Preset](https://img.shields.io/badge/Dino_Ovum-preset-2e8555?style=flat-square) | `@dino-ovum/preset` | Shared site configuration, documents, sidebars, search, PWA, navigation, and recent updates |
| ![Dino Ovum Theme](https://img.shields.io/badge/Dino_Ovum-theme-2e8555?style=flat-square) | `@dino-ovum/theme` | Shared UI, components, layouts, styles, fonts, and default UI translations |

The packages target Docusaurus **3.10.1**, React **19**, and Node.js **>=24.22.1 <25**. This workspace uses pnpm **10.5.2**. The first version supports one document root.

## Install

Run the development and verification site from this repository with Node.js and pnpm installed:

```sh
git clone https://github.com/4BFC/dino-ovum.git
cd dino-ovum
nvm use
pnpm install --frozen-lockfile
pnpm start
```

`nvm use` selects the version in `.nvmrc`; skip it if that Node.js version is already active.

The packages are implemented, but have **not been published to npm**. Create local distribution archives with:

```sh
pnpm pack:packages
```

The two `.tgz` files are written to `artifacts/`. Follow the [development guide](./docs/development.md) to install them in another site before the registry release.

## Usage

Configure a site using the preset:

```js
import {createDinoConfig} from '@dino-ovum/preset/config';

export default createDinoConfig(
  {
    title: 'My documents',
    url: 'https://example.com',
    baseUrl: '/',
    themeConfig: {navbar: {logo: {src: 'img/logo.svg'}}},
  },
  {
    customCss: './src/css/custom.css',
    updates: true,
    pwa: false,
  },
);
```

Keep documents in `documents/`, images in `public/`, and site styles in `src/css/custom.css`. The preset loads the shared theme. Search is enabled by default; PWA and the recent-updates page are optional.

```text
user site (dino-nest after migration)
  → @dino-ovum/preset
      → @dino-ovum/theme
```

`website/` demonstrates this structure without local copies of the shared application or theme. Updating the packages brings shared improvements while preserving site files. The existing dino-nest repository has not been migrated as part of this implementation.

See the [configuration guide](./docs/configuration.md), [architecture](./docs/architecture.md), and [migration guide](./docs/migration.md).

## Features

| Feature | Description | Package | Setting (default) |
| --- | --- | --- | --- |
| Documents and search | Shared document setup, automatic sidebars, and local search | preset | `search` (on) |
| Navigation and updates | Document navigation and a recent-updates page | preset, theme | `updates` (off) |
| Design | Shared layouts, styles, Pretendard fonts, and light/dark themes | theme | always on |
| Multilingual UI | English, Korean, and Japanese UI; the site can override messages | theme | `i18n` in the first argument |
| PWA | Manifest and offline support, including subpath deployments | preset | `pwa` (off) |
| Customization | Custom CSS and component wrappers survive package upgrades | preset, theme | `customCss`, `src/theme/` |

```sh
pnpm build             # Build all three locales
pnpm serve             # Preview the production site
pnpm check             # Lint, unit tests, and site build
pnpm verify:packages   # Isolated archive installation and upgrade checks
```

The [implementation plan](./docs/implementation-plan.md) separates completed package work from npm publication and template migration.

## Maintainer

[4BFC](https://github.com/4BFC)

## Contributing

Questions and bug reports are welcome in [GitHub Issues](https://github.com/4BFC/dino-ovum/issues).
Read the [development guide](./docs/development.md) before changing the packages.

## License

[Unlicense](./LICENSE).
[NOTICE](./NOTICE) preserves the original MIT notice for code and examples from dino-nest. Third-party assets and dependencies retain their own licenses.
