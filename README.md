WWAWing/sites
============

WWA Wing でホストしているサイトを含むリポジトリです。
FQDN がディレクトリ名と対応しています。

| FQDN / ディレクトリ名 | 概要 |
| --------------------- | ---- |
| wwawing.com           | トップページ・サンプルページ |


**※ \*nix環境以外でのページ生成はサポートされていません。 お手数ですが、Windows の方は Windows Subsystem for Linux のご利用をお願いいたします。**

## CI類
- netlify: masterブランチに新しいコミットが生成された時, 各ページを生成して Netlify のホスティング環境に配置する。

## サイト以外のディレクトリ
- `./scripts`: 新規リリースなどで使うスクリプトが格納されるディレクトリ。

## scripts の使い方
まずは

``` sh
$ npm install
```

### コマンド
- `./scripts/deploy-demo.sh `: デモページの各種ファイルを配置する。
- `npm run generate-download-page`: ダウンロードページを生成する。
- `npm run fill-version`: トップページを生成する。(トップページに最新バージョンを書き込む) 
- `npm start`: 上記3つを実行します。

### ライセンス
- MIT
- ただし、配布物の画像・音源・ドキュメントは CC-BY-4.0

## 行動規範
- Contributer Covenant Code of Conduct に従います。
  - [原文(英語)](./CODE_OF_CONDUCT.md)
  - [日本語訳](./CODE_OF_CONDUCT_ja.md)
