#!/bin/sh

set -eu

## 安定版デプロイ 
STABLE_LATEST_VERSION=$(node -e "console.log(require('./releases.json').data.stable.releases[0].version)")
wget "https://github.com/WWAWing/WWAWing/releases/download/v$STABLE_LATEST_VERSION/wwawing-dist.zip"
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

## 不安定版デプロイ
UNSTABLE_LATEST_VERSION=$(node -e "console.log(require('./releases.json').data.unstable.releases[0].version)")
wget "https://github.com/WWAWing/WWAWing/releases/download/v$UNSTABLE_LATEST_VERSION/wwawing-dist.zip"
unzip -d wwawing-dist wwawing-dist.zip

DEST_DIR="./wwawing.com/unstable"
cp "$SRC_DIR/mapdata/wwamap.dat" $DEST_DIR
if [ -e "$SRC_DIR/mapdata/picture_test.dat" ] ; then
    cp "$SRC_DIR/mapdata/picture_test.dat" $DEST_DIR
fi
cp "$SRC_DIR/mapdata/wwa.js" $DEST_DIR
cp "$SRC_DIR/mapdata/wwa.css" $DEST_DIR
cp "$SRC_DIR/mapdata/style.css" $DEST_DIR
cp "$SRC_DIR/mapdata/making.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/cover.gif" $DEST_DIR
cp -R "$SRC_DIR/mapdata/audio" $DEST_DIR
cp -R "$SRC_DIR/mapdata/script" $DEST_DIR

# ピクチャ機能で使用
if [ -e "$SRC_DIR/mapdata/picture_test-picture.json" ] ; then
    cp "$SRC_DIR/mapdata/picture_test-picture.json" $DEST_DIR
    cp "$SRC_DIR/mapdata/wwawing-disp.png" $DEST_DIR
fi

# ピクチャ機能入門で改造したケーブダンジョン1で使用
if [ -e "$SRC_DIR/mapdata/caves01.gif" ] ; then
    cp "$SRC_DIR/mapdata/wwa.js" "$DEST_DIR/caves01_picture"
    cp "$SRC_DIR/mapdata/wwa.css" "$DEST_DIR/caves01_picture"
    cp "$SRC_DIR/mapdata/style.css" "$DEST_DIR/caves01_picture"
    cp "$SRC_DIR/mapdata/caves01.gif" "$DEST_DIR/caves01_picture"
    cp "$SRC_DIR/mapdata/cover.gif" "$DEST_DIR/caves01_picture"
    mkdir -p "$DEST_DIR/caves01_picture/audio"
    cp "$SRC_DIR/mapdata/audio/1.mp3" "$DEST_DIR/caves01_picture/audio"
    cp "$SRC_DIR/mapdata/audio/3.mp3" "$DEST_DIR/caves01_picture/audio"
    cp "$SRC_DIR/mapdata/audio/11.mp3" "$DEST_DIR/caves01_picture/audio"
    cp "$SRC_DIR/mapdata/audio/12.mp3" "$DEST_DIR/caves01_picture/audio"
    cp "$SRC_DIR/mapdata/audio/13.mp3" "$DEST_DIR/caves01_picture/audio"
    cp "$SRC_DIR/mapdata/audio/16.mp3" "$DEST_DIR/caves01_picture/audio"
    cp "$SRC_DIR/mapdata/audio/70.mp3" "$DEST_DIR/caves01_picture/audio"
    cp "$SRC_DIR/mapdata/audio/71.mp3" "$DEST_DIR/caves01_picture/audio"
    cp "$SRC_DIR/mapdata/audio/72.mp3" "$DEST_DIR/caves01_picture/audio"
fi

rm -rf $SRC_DIR ./wwawing-dist ./wwawing-dist.zip
