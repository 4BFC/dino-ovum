# @dino-ovum/theme

Shared Docusaurus components, styles, fonts, and UI translations for Dino Ovum.

Use through `@dino-ovum/preset`, which registers the base theme and shared data plugins. Adding this theme alone does not configure document navigation or search.

Public components for MDX and custom pages:

```jsx
import HomeHeading from '@theme/DinoOvum/HomeHeading';
import DocumentTable from '@theme/DinoOvum/DocumentTable';
import LibraryLayout from '@theme/DinoOvum/LibraryLayout';
import Updates from '@theme/DinoOvum/Updates';
import UpdatesPage from '@theme/DinoOvum/UpdatesPage';
```

Pass `customCss` to the preset to load site styles after the shared theme. Override individual components in your site's `src/theme/`; use `@theme-original` there to wrap the package implementation.

Korean and Japanese UI messages are bundled; English messages are provided by the components. Site `code.json` translations override defaults. Existing `docnest.*` message IDs are retained for migration compatibility.

Pure route, date, and document-location helpers are exported from `@dino-ovum/theme/utils` for build-time integration. Internal `src/app` paths are not public API.

MIT. The bundled Pretendard font retains its license in `src/assets/fonts/pretendard/LICENSE`.
