<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="../../public/img/logo.png">
    <source media="(prefers-color-scheme: light)" srcset="../../public/img/logo.png">
    <img alt="" src="../../public/img/logo.png" width="96" height="96" align="bottom">
  </picture>&ensp;dino-ovum
</h1>

dino-nest のための共通 Docusaurus preset と theme です。

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](../../LICENSE)
[![Standard Readme](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

文書、ブランド、サイト設定は自分のプロジェクトで管理できます。Dino Ovum は preset と theme
パッケージを通じて、dino-nest の共通機能とデザインを提供します。

<div align="center">
<table align="center">
  <tr>
    <td align="center"><a href="../eng/README.md"><img src="https://img.shields.io/badge/English-555555?style=flat-square" alt="English"></a></td>
    <td align="center"><a href="../ko/README.md"><img src="https://img.shields.io/badge/%ED%95%9C%EA%B5%AD%EC%96%B4-555555?style=flat-square" alt="한국어"></a></td>
    <td align="center"><a href="README.md"><img src="https://img.shields.io/badge/%E6%97%A5%E6%9C%AC%E8%AA%9E-0969DA?style=flat-square" alt="日本語"></a></td>
  </tr>
</table>
</div>

設定ガイドと移行ガイドは `docs/` で韓国語として管理します。

## 目次

- [仕様](#仕様)
- [インストール](#インストール)
- [使い方](#使い方)
- [主な機能](#主な機能)
- [メンテナー](#メンテナー)
- [貢献](#貢献)
- [ライセンス](#ライセンス)

## 仕様

Dino Ovum 0.1.0 は二つのパッケージで構成されています。

| 構成 | パッケージ | 説明 |
| --- | --- | --- |
| ![Dino Ovum Preset](https://img.shields.io/badge/Dino_Ovum-preset-2e8555?style=flat-square) | `@dino-ovum/preset` | 共通サイト設定、文書・サイドバー、検索・PWA・ナビゲーション・最近の更新 |
| ![Dino Ovum Theme](https://img.shields.io/badge/Dino_Ovum-theme-2e8555?style=flat-square) | `@dino-ovum/theme` | 共通 UI・コンポーネント・レイアウト・スタイル・フォント・標準 UI 翻訳 |

対応環境は Docusaurus **3.10.1**、React **19**、Node.js **>=24.22.1 <25** です。開発 workspace は pnpm **10.5.2** を使います。初期バージョンでは文書ルートを一つサポートします。

## インストール

Docusaurus サイトに preset をインストールします。対応する `@dino-ovum/theme` も一緒にインストールされます。

```sh
pnpm add @dino-ovum/preset @docusaurus/core@3.10.1 @mdx-js/react react react-dom
```

パッケージを開発するときは、Node.js と pnpm を用意して、このリポジトリの開発・検証サイトを起動します。

```sh
git clone https://github.com/4BFC/dino-ovum.git
cd dino-ovum
nvm use
pnpm install --frozen-lockfile
pnpm start
```

`nvm use` は `.nvmrc` の Node.js バージョンを選択します。すでに同じバージョンを使っている場合は省略できます。

未公開の変更を別のサイトで確認するときは、`pnpm pack:packages` でアーカイブを作成します。

## 使い方

サイト設定から preset を使います。

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

文書は `documents/`、画像は `public/`、カスタムスタイルは `src/css/custom.css` に置きます。preset が共通 theme を読み込みます。検索は標準で有効になり、PWA と最近の更新ページは任意で有効にできます。

```text
利用者のサイト（移行後の dino-nest）
  → @dino-ovum/preset
      → @dino-ovum/theme
```

`website/` は共通 app や theme のローカルコピーを持たず、この構成で動作します。パッケージを更新すると、サイトのファイルを保ちながら共通の改善を受け取れます。今回の実装では既存の dino-nest リポジトリは移行していません。

詳細は[設定ガイド](../../docs/configuration.md)と[移行ガイド](../../docs/migration.md)を参照してください。

## 主な機能

| 機能 | 説明 | パッケージ | 設定（既定値） |
| --- | --- | --- | --- |
| 文書と検索 | 共通の文書設定、自動サイドバー、ローカル検索 | preset | `search`（有効） |
| ナビゲーションと最近の更新 | 文書ナビゲーションと最近の更新ページ | preset, theme | `updates`（無効） |
| デザイン | 共通レイアウト、スタイル、Pretendard フォント、ライト／ダークテーマ | theme | 常に適用 |
| 多言語 UI | 英語、韓国語、日本語の UI と利用者による翻訳の上書き | theme | 第1引数の `i18n` |
| PWA | manifest とオフライン機能、サブパス配信に対応 | preset | `pwa`（無効） |
| カスタマイズ | パッケージ更新後も保持されるカスタム CSS とコンポーネントラッパー | preset, theme | `customCss`、`src/theme/` |

```sh
pnpm build             # 三言語をビルド
pnpm serve             # 本番サイトをプレビュー
pnpm check             # Lint、単体テスト、サイトビルド
pnpm verify:packages   # 独立したサイトでアーカイブのインストールと更新を検証
```

## メンテナー

[4BFC](https://github.com/4BFC)

## 貢献

質問や不具合は [GitHub Issues](https://github.com/4BFC/dino-ovum/issues) にお寄せください。
パッケージを変更したら `pnpm check` と `pnpm verify:packages` を実行してください。

## ライセンス

[MIT](../../LICENSE) を適用します。コードは同じライセンスと著作権者の dino-nest から分離しました。外部の素材と依存パッケージはそれぞれのライセンスを維持します。
