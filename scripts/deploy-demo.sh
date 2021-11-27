#!/bin/sh

set -eu

## スタンダードマップとマニュアルを最新から持ってきて配置
LATEST_VERSION=$(node -e "console.log(require('./releases.json').stable.releases[0])")
wget "https://github.com/WWAWing/WWAWing/releases/download/v$LATEST_VERSION/wwawing-dist.zip"
unzip -d wwawing-dist wwawing-dist.zip
  
SRC_DIR="./wwawing-dist/wwawing-dist"
DEST_DIR="./wwawing.com/wing"
cp "$SRC_DIR/manual.html" $DEST_DIR
cp "$SRC_DIR/mapdata/wwamap.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/making.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/island02.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/island02.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/caves01.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/caves01.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/caves02.dat" $DEST_DIR
cp "$SRC_DIR/mapdata/caves02.gif" $DEST_DIR
cp "$SRC_DIR/mapdata/cover.gif" $DEST_DIR
cp -R "$SRC_DIR/mapdata/audio" $DEST_DIR

rm -rf ./wwawing-dist ./wwawing-dist.zip
