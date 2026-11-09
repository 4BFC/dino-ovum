---
title: README 執筆基準
sidebar_label: README 執筆基準
description: Docnest の文書の役割、言語バッジ、仕様表、執筆基準です。
slug: /standard/readme-style-standard
sidebar_position: 1
created_at: 2026-11-09
updated_at: 2026-11-09
---

> この文書は dino-nest 由来の検証用サンプルです。表・見出し・リンク・翻訳されたナビゲーションの表示を確認します。Dino Ovum リポジトリの作業方法は[開発ガイド](https://github.com/4BFC/dino-ovum/blob/main/docs/development.md)を参照してください。


Docnest のユーザー向けガイドと開発者向けガイドの執筆基準です。共通の基準は `documents/standard/` にまとめ、サイトにも公開します。
[Standard Readme 仕様](https://github.com/RichardLitt/standard-readme/blob/main/spec.md)の基本構成と、
[Shelter README](https://github.com/4BFC/shelter)、[Shelter の執筆基準](https://github.com/4BFC/shelter/blob/main/CONTRIBUTING.md#writing-documentation)の言語バッジと仕様表を参考にしています。

## 文書の役割 {#document-roles}

| 文書 | 読者と目的 | 含める内容 |
| --- | --- | --- |
| README | Docnest を利用する人 | 紹介、簡潔な仕様、インストール、文書の作成、基本的な使い方 |
| CONTRIBUTING | コードを変更、保守する人 | 開発環境、ソースの責務、検査、コミット、公開手順 |
| `src/README.md` | 構造を理解したい開発者 | ディレクトリの責務と依存関係の方向 |
| `documents/standard/` | 文書を保守する人 | 共通の執筆基準 |

README にルーティングの内部実装、プラグインの回避策、lint コマンド、開発ツールの説明を詰め込みません。
初めて利用するために必要な最小限のコマンドを載せ、詳しい環境設定は CONTRIBUTING にリンクします。

## README の構成 {#readme-structure}

1. テーマに対応するロゴ、製品名、一文の紹介、製品バッジから始めます。英語の紹介は `package.json` の `description` に合わせます。
   Standard Readme バッジを元のプロジェクトにリンクし、標準に従っているという説明文は別途追加しません。
2. 言語選択、目次、仕様、インストール、使い方、機能、管理者、貢献、ライセンスの順に記載します。
3. すべての第2レベル見出しを目次から参照し、ライセンスを最後に置きます。
4. 動作する短いコマンドや文書例と、その結果を示します。
5. 未完成の機能や例示用の公開 URL を、利用可能なサービスとして紹介しません。

Standard Readme をプロジェクトに合わせて適用します。Shelter と同様、利用条件を確認できるよう仕様をインストールの前に置きます。
翻訳ファイルは標準の `README.<言語>.md` 形式ではなく、以下のディレクトリに配置します。
Standard Readme バッジは書式の出典へのリンクです。プロジェクト固有の適用方法はこの文書で管理します。

## 言語とパス {#languages-and-paths}

- ルートの README と CONTRIBUTING は英語で、`language/eng/` の本文と一致させます。
- リポジトリのガイドは `language/eng/`、`language/ko/`、`language/jp/` に置き、各フォルダに `README.md` と `CONTRIBUTING.md` を用意します。
- 上部に中央揃えの HTML 表を置き、English、한국어、日本語のバッジを表示します。
- 選択中の言語は `0969DA`、ほかは `555555` とし、すべて `style=flat-square` を使用します。
- 言語バッジは同じ種類の文書にリンクします。CONTRIBUTING からは各言語の CONTRIBUTING に移動します。
- パスは各ファイルからの相対パスです。コマンドはリポジトリのルートで実行します。
- 公開文書の Docusaurus ロケールは `en`、`ko`、`ja` です。英語の原文は `documents/` に置きます。
- 韓国語と日本語の文書は `documents/_translations/<locale>/docusaurus-plugin-content-docs/current/` に置き、原文とファイル名、slug をそろえます。
- UI の翻訳は各ロケールの `code.json` に置きます。`_translations` は英語の文書ツリーから除外されます。
- 言語セレクターは同じ文書の翻訳版を開きます。翻訳内容と固定の見出し ID を対応させてください。
- リポジトリのガイド用フォルダ名 `eng`、`jp` はサイトのロケールコードではありません。

## 仕様の表記 {#specifications}

仕様表は、構成要素、技術バッジ、利用者向けの説明の3列にします。
バッジには実際のバージョン、`style=flat-square`、提供されている技術アイコンを含めます。
README には主な実行環境と基盤技術だけを載せ、開発依存関係をすべて列挙しません。

バージョンの根拠として `package.json` と `pnpm-lock.yaml` にリンクします。
宣言されたバージョン範囲と固定されたバージョンを区別します。Node.js 24 は対応するメジャー系統であり、
最小バージョンと上限は別に記載します。変更時はすべての言語の表を更新します。

## 執筆と検証 {#writing-and-checks}

- 短い文、段階的な手順、比較しやすい表を使います。
- コードブロックの言語を指定し、見出し、リスト、表の前後に空行を置きます。
- UI の名称、コマンド、パス、バージョンを翻訳時に変えません。
- ルートの英語版と各翻訳版の内容、コマンド、目次、相対リンクを確認します。
- 言語選択、技術バッジ、表、コードブロック、テーマ別 README ロゴをプレビューします。
- 公開文書を3言語で確認し、同じ文書への言語切り替え、モバイルナビゲーション、両テーマを検証します。
- リポジトリの README と CONTRIBUTING は、公開用の `documents/` に入れません。
