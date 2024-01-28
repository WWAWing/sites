#!/bin/sh

set -eu

## スタンダードマップとマニュアルを最新から持ってきて配置
LATEST_VERSION=$(node -e "console.log(require('./releases.json').releaseUnits[0].stable.version)")
wget "https://github.com/WWAWing/WWAWing/releases/download/v$LATEST_VERSION/wwawing-dist.zip"
unzip -d wwawing-dist wwawing-dist.zip
  
SRC_DIR="./wwawing-dist/wwawing-dist"
DEST_DIR="./wwawing.com/wing"

cp "$SRC_DIR/manual.html" $DEST_DIR
cp "$SRC_DIR/mapdata/wwamap.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/wwa.js" $DEST_DIR
cp "$SRC_DIR/mapdata/wwa.css" $DEST_DIR
cp "$SRC_DIR/mapdata/style.css" $DEST_DIR
cp "$SRC_DIR/mapdata/making.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/island02.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/island02.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/caves01.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/caves01.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/caves02.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/caves02.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/cover.gif" $DEST_DIR
cp -R "$SRC_DIR/mapdata/audio" $DEST_DIR

rm -rf $SRC_DIR wwawing-dist wwawing-dist.zip

## unstable バージョン デプロイ
if [ "$(node -e "console.log(typeof require('./releases.json').releaseUnits[0].unstable)")" == "undefined" ] ; then
    exit;
fi

UNSTABLE_LATEST_VERSION=$(node -e "console.log(require('./releases.json').releaseUnits[0].unstable[0].releases[0].version)")
wget "https://github.com/WWAWing/WWAWing/releases/download/v$UNSTABLE_LATEST_VERSION/wwawing-dist.zip"
unzip -d wwawing-dist wwawing-dist.zip

DEST_DIR="./wwawing.com/unstable"
cp "$SRC_DIR/mapdata/wwamap.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/picture_test.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/wwa.js" $DEST_DIR
cp "$SRC_DIR/mapdata/wwa.css" $DEST_DIR
cp "$SRC_DIR/mapdata/style.css" $DEST_DIR
cp "$SRC_DIR/mapdata/making.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/cover.gif" $DEST_DIR
cp -R "$SRC_DIR/mapdata/audio" $DEST_DIR

# ピクチャ機能で使用
cp "$SRC_DIR/mapdata/picture_test-picture.json" $DEST_DIR
cp "$SRC_DIR/mapdata/wwawing-disp.png" $DEST_DIR

rm -rf $SRC_DIR ./wwawing-dist ./wwawing-dist.zip
