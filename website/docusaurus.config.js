import {createDinoConfig} from '@dino-ovum/preset/config';

export default createDinoConfig(
  {
    title: 'Dino Ovum',
    tagline: 'Shared packages for your documentation site',
    url: 'https://example.com',
    baseUrl: '/',
    favicon: 'img/icon.svg',
    customFields: {version: '0.1.1'},
    themeConfig: {
      navbar: {
        logo: {
          alt: 'Dino Ovum',
          src: 'img/icon-light.svg',
          srcDark: 'img/icon-dark.svg',
          width: 30,
          height: 30,
        },
      },
    },
  },
  {
    customCss: './src/css/custom.css',
    updates: true,
    pwa: {
      manifest: {
        icons: [{src: 'img/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any'}],
      },
    },
  },
);
