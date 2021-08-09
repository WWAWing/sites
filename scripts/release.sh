#!/bin/sh

if [ -n "$NETLIFY" ]; then 
  ## スタンダードマップとマニュアルを最新から持ってきて配置
  LATEST_VERSION=$(node -e "console.log(require('./releases.json').releases[0])")
  wget "https://github.com/WWAWing/WWAWing/releases/download/v$LATEST_VERSION/wwawing-dist.zip"
  unzip -d wwawing-dist wwawing-dist.zip
  cp wwawing-dist/manual.html ./wwawing.com/wing
  cp wwawing-dist/mapdata/wwamap.dat ./wwawing/com/wing
  rm -rf ./wwawing-dist ./wwawing-dist.zip

  # トップページバージョン埋めとリリースページ生成
  npm start
  if [ $? -eq 1 ]; then
    echo "runtime error."
    exit 1
  fi
fi
