---
title: README style standard
sidebar_label: README writing guide
description: Document roles, language badges, specifications, and writing standards for Docnest.
slug: /standard/readme-style-standard
sidebar_position: 1
created_at: 2026-11-09
updated_at: 2026-11-09
---

> This sample document comes from dino-nest. It verifies the rendering of tables, headings, links, and translated navigation. For the Dino Ovum repository workflow, see the [README](https://github.com/4BFC/dino-ovum#readme).


This guide defines how Docnest's user and contributor documentation is written. Shared writing standards live in `documents/standard/` and are published on the site.
It follows the basic structure of the [Standard Readme specification](https://github.com/RichardLitt/standard-readme/blob/main/spec.md)
and the language badges and specification tables in the [Shelter README](https://github.com/4BFC/shelter) and [Shelter writing guide](https://github.com/4BFC/shelter/blob/main/CONTRIBUTING.md#writing-documentation).

## Document roles {#document-roles}

| Document | Audience and purpose | Contents |
| --- | --- | --- |
| README | People using Docnest | Introduction, concise specifications, installation, writing documents, and everyday use |
| CONTRIBUTING | People changing or maintaining the code | Development setup, source responsibilities, checks, commits, and publishing |
| `src/README.md` | Developers exploring the structure | Directory responsibilities and dependency direction |
| `documents/standard/` | Documentation maintainers | Shared writing standards |

Keep routing internals, plugin workarounds, lint commands, and development tools out of README.
Include the minimum commands needed to start using the product, and link to CONTRIBUTING for detailed setup.

## README structure {#readme-structure}

1. Start with the theme-aware project logo, product name, one-sentence introduction, and product badges. Match the English introduction to `package.json`'s `description`.
   Include a Standard Readme badge linked to the original project; do not add a separate claim about following the standard.
2. Follow with language selection, contents, specifications, installation, usage, features, maintainer, contributing, and license.
3. Link every level-two heading from the contents list. Put the license last.
4. Use short, working commands or document examples and describe their expected results.
5. Do not present unfinished features or example deployment URLs as available services.

Adapt Standard Readme to the project. As in Shelter, specifications come before installation so users can check requirements first.
Translation files use the directories below instead of the standard's `README.<language>.md` convention.
The Standard Readme badge links to the style's source; this document records the project-specific choices.

## Languages and paths {#languages-and-paths}

- Root README and CONTRIBUTING are in English and match the English content in `language/eng/`.
- Repository guides use `language/eng/`, `language/ko/`, and `language/jp/`, each containing `README.md` and `CONTRIBUTING.md`.
- Center an HTML table of English, 한국어, and 日本語 badges near the top.
- Highlight the current language with `0969DA`; use `555555` for the others and `style=flat-square` for all.
- Link language badges to the same document type. CONTRIBUTING badges lead to translated CONTRIBUTING files.
- Resolve paths relative to each file. Run example commands from the repository root.
- Published documents use Docusaurus locales `en`, `ko`, and `ja`. English source files live in `documents/`.
- Store Korean and Japanese documents in `documents/_translations/<locale>/docusaurus-plugin-content-docs/current/`, preserving source file names and slugs.
- UI messages live in each locale's `code.json`. The `_translations` directory is excluded from the English document tree.
- The navigation language selector opens the same document in another language. Keep translations and stable heading IDs aligned.
- The repository guide directory names `eng` and `jp` are not site locale codes.

## Specifications {#specifications}

Use three columns: component, technology badge, and a description useful to the reader.
Badges show the actual version, `style=flat-square`, and the technology's icon when available.
Keep only major runtime and platform technologies in README; do not list every development dependency.

Link version evidence to `package.json` and `pnpm-lock.yaml`.
Distinguish declared version ranges from locked versions. Node.js 24 identifies the supported major series;
state the minimum and upper bounds separately. Update all language tables when versions change.

## Writing and checks {#writing-and-checks}

- Use short sentences, step-by-step instructions, and comparable tables.
- Specify code-block languages and leave blank lines around headings, lists, and tables.
- Keep UI names, commands, paths, and versions consistent across translations.
- Check content, commands, contents links, and relative links in the root English and all translated guides.
- Preview language selection, technology badges, tables, code blocks, and theme-aware README logos.
- Check every published document in all three languages, including same-document switching, mobile navigation, and both color modes.
- Keep repository README and CONTRIBUTING files outside publishable site content in `documents/`.
