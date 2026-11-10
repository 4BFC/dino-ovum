# @dino-ovum/preset

Docusaurus configuration and shared document, navigation, search, and PWA plugins for Dino Ovum.

```js
import {createDinoConfig} from '@dino-ovum/preset/config';

export default createDinoConfig(
  {title: 'My documents', url: 'https://example.com'},
  {customCss: './src/css/custom.css', updates: true},
);
```

The preset includes the compatible `@dino-ovum/theme`. Use Docusaurus 3.10.1, React 19, and Node.js 24.22.1–24.x. Documents default to `documents/`, with translations under `documents/_translations/`.

Search is enabled by default. PWA and the `/updates` page are opt-in. Site settings override defaults; nested objects merge and arrays replace. Additional site plugins, themes, and presets are retained.

Read the [configuration guide](https://github.com/4BFC/dino-ovum/blob/main/docs/configuration.md) for options, translation overrides, and migration. See the [repository README](https://github.com/4BFC/dino-ovum#install) for local archive installation while the initial release is being prepared.

MIT. Dependencies retain their own licenses.
