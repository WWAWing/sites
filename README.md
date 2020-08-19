WWAWing/sites
============

WWA Wing でホストしているサイトを含むリポジトリです。
FQDN がディレクトリ名と対応しています。

| FQDN / ディレクトリ名 | 概要 |
| --------------------- | ---- |
| wwawing.com           | トップページ・サンプルページ |
| get.wwawing.com       | 配布ページ |

## CI類
- dependabot: `@wwawing/all` などの依存パッケージの新しいバージョンがpublishされた時に、そのバージョンをリリースするPull Requestを作成する。
- netlify: masterブランチに新しいコミットが生成された時, 各ページを生成して Netlify のホスティング環境に配置する。

## サイト以外のディレクトリ
- `./scripts`: 新規リリースなどで使うスクリプトが格納されるディレクトリ。
- `./output`: `npm run make-dist` で生成される配布物が格納されるディレクトリ。gitは追跡しない。

## scripts の使い方
まずは

``` sh
$ npm install
```

### コマンド
- `npm run generate-download-page`: ダウンロードページを生成する。
- `npm run fill-version`: トップページを生成する。(トップページに最新バージョンを書き込む) 
- `npm start`: 上記2つを並列に実行します。

### ライセンス
- MIT
- ただし、配布物の画像・音源・ドキュメントは CC-BY-4.0
