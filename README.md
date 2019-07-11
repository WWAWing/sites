## get.wwaing.com

### 使い方

まずは

``` sh
$ npm install
```

### ディレクトリ
- `./docs`: `get.wwawing.com` にデプロイされるファイル群。 Netlifyにホストされている。
- `./output`: `npm run make-dist` で生成される配布物が格納されるディレクトリ。gitは追跡しない。
- `./scripts`: 各種スクリプト

### コマンド
- `npm start`: `npm run make-dist` して　`npm run release` する。
- `npm run make-dist`: `./output` 下にWWA Wingの配布物{圧縮前, 圧縮後}x{完全版, 更新版}の4つを生成。
- `npm run release`: `npm run make-dist` で生成したファイルを `./docs` 下にコピーし、 `./docs/index.html` から配布物にリンクを貼る。

### ライセンス
- MIT
- ただし、配布物の画像・音源・ドキュメントは CC-BY-4.0

### その他
- 配布物に詰め込まれるファイルは `npm install` した時に `node_modules` 下にダウンロードされる `@wwawing/****` パッケージから準備される。
