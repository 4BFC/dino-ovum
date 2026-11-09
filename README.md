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

Dino Ovum's package structure and responsibilities:

| Component | Package | Description |
| --- | --- | --- |
| ![Dino Ovum Preset](https://img.shields.io/badge/Dino_Ovum-preset-2e8555?style=flat-square) | `@dino-ovum/preset` | Shared site configuration, document and sidebar setup, search, PWA, navigation, and recent-update plugins |
| ![Dino Ovum Theme](https://img.shields.io/badge/Dino_Ovum-theme-2e8555?style=flat-square) | `@dino-ovum/theme` | Shared UI, components, layouts, styles, fonts, and default UI translations |

## Install

This repository currently contains documentation and project branding. Package extraction and publication are not complete, so package installation commands are not available yet.

See the [implementation plan](./docs/implementation-plan.md) for the work stages and verification criteria.

## Usage

Use [dino-nest](https://github.com/4BFC/dino-nest) as the template for your own document site. Dino Ovum is the repository for developing and releasing its shared packages.

The target relationship is:

```text
dino-nest
  → @dino-ovum/preset
      → @dino-ovum/theme
```

Documents, logos, site settings, and custom CSS stay in the user project. Shared improvements reach the site through a package update, a build check, and redeployment.

The [architecture document](./docs/architecture.md) explains repository boundaries and customization.

## Features

The package design covers:

- Shared document, search, PWA, and sidebar configuration.
- Navigation and recent-update data generation.
- Shared layouts, components, styles, and fonts.
- Default UI translations and user customization.

The first implementation milestone is a verification site using the packaged artifacts. See the [implementation plan](./docs/implementation-plan.md) for the current status.

## Maintainer

[4BFC](https://github.com/4BFC)

## Contributing

Questions and bug reports are welcome in [GitHub Issues](https://github.com/4BFC/dino-ovum/issues).
Read the [architecture](./docs/architecture.md) and [implementation plan](./docs/implementation-plan.md) before proposing package changes.

## License

[Unlicense](./LICENSE).
Third-party assets and dependencies retain their own licenses and notices.
