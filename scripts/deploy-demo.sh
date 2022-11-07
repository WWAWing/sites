#!/bin/sh

set -eu

## スタンダードマップとマニュアルを最新から持ってきて配置
LATEST_VERSION=$(node -e "console.log(require('./releases.json').releaseUnits[0].stable.version)")
wget "https://github.com/WWAWing/WWAWing/releases/download/v$LATEST_VERSION/wwawing-dist.zip"
unzip -d wwawing-dist wwawing-dist.zip
  
SRC_DIR="./wwawing-dist/wwawing-dist"
DEST_DIR="./wwawing.com/wing"
## new-message-system バージョンを公開していた時のスクリプトをコメントアウトしています。
## 今後、不安定版のプレビューが必要になった時はコメントアウトを外していい感じに改変してください。
## HACK: プレビューをデプロイすべきタグ名を、releases.json の releaseUnits[0] から自動で取得して回したい。

## DEST_DIR_NEW_MESSAGE_SYSTEM="./wwawing.com/new-message-system"
cp "$SRC_DIR/manual.html" $DEST_DIR
cp "$SRC_DIR/mapdata/wwamap.dat" $DEST_DIR
# cp "$SRC_DIR/mapdata/wwamap.dat" $DEST_DIR_NEW_MESSAGE_SYSTEM
cp "$SRC_DIR/mapdata/wwa.js" $DEST_DIR
# cp "$SRC_DIR/mapdata/wwa.js" $DEST_DIR_NEW_MESSAGE_SYSTEM
cp "$SRC_DIR/mapdata/wwa.css" $DEST_DIR
# cp "$SRC_DIR/mapdata/wwa.css" $DEST_DIR_NEW_MESSAGE_SYSTEM
cp "$SRC_DIR/mapdata/style.css" $DEST_DIR
# cp "$SRC_DIR/mapdata/style.css" $DEST_DIR_NEW_MESSAGE_SYSTEM
cp "$SRC_DIR/mapdata/making.gif" $DEST_DIR
# cp "$SRC_DIR/mapdata/making.gif" $DEST_DIR_NEW_MESSAGE_SYSTEM
cp "$SRC_DIR/mapdata/island02.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/island02.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/caves01.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/caves01.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/caves02.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/caves02.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/cover.gif" $DEST_DIR
# cp "$SRC_DIR/mapdata/cover.gif" $DEST_DIR_NEW_MESSAGE_SYSTEM
cp -R "$SRC_DIR/mapdata/audio" $DEST_DIR
# cp -R "$SRC_DIR/mapdata/audio" $DEST_DIR_NEW_MESSAGE_SYSTEM

rm -rf ./wwawing-dist ./wwawing-dist.zip
