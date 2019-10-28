WWAWing/sites
============

WWA Wing でホストしているサイトを含むリポジトリです。
FQDN がディレクトリ名と対応しています。

| FQDN / ディレクトリ名 | 概要 |
| --------------------- | ---- |
| wwawing.com           | トップページ・サンプルページ・配布ページ |
| get.wwawing.com       | 旧配布ページから現行配布ページへのリダイレクト |

## CI類
- dependabot: `@wwawing/all` の新しいバージョンがpublishされた時に、そのバージョンをリリースするPull Requestを作成する。（準備中）
- travis-ci.com: masterブランチに新しいコミットが生成された時, 依存している `@wwawing/all` のバージョンがリリースされてない時に動く。配布物(完全版, 更新版)のZIPを生成する。（まだコミット/pushしていないがする予定)
- netlify: masterブランチに新しいコミットが生成された時, 依存している　`@wwawing/all` のバージョンが既にリリースされている場合に動く。サイトをデプロイする。（準備中 現在はすべてのコミットに対して生成している）

## サイト以外のディレクトリ
- `./scripts`: 新規リリースなどで使うスクリプトが格納されるディレクトリ。
- `./output`: `npm run make-dist` で生成される配布物が格納されるディレクトリ。gitは追跡しない。

## scripts の使い方
まずは

``` sh
$ npm install
```

### コマンド
- `npm start`: `npm run make-dist` して　`npm run release` する。
- `npm run make-dist`: `./output` 下にWWA Wingの配布物{圧縮前, 圧縮後}x{完全版, 更新版}の4つを生成。
- `npm run release`: `npm run make-dist` で生成したファイルを `./get.wwawing.com` 下にコピーし、 `./get.wwawing,com/index.html` から配布物にリンクを貼る。

### ライセンス
- MIT
- ただし、配布物の画像・音源・ドキュメントは CC-BY-4.0

### その他
- 配布物に詰め込まれるファイルは `npm install` した時に `node_modules` 下にダウンロードされる `@wwawing/****` パッケージから準備される。