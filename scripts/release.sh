#!/bin/sh

# リリーススクリプト
# - travis の master ブランチへのコミット時 -> 何もしない
# - netlify の master ブランチへのコミット時 -> HTML生成＋デプロイ
# - netlify の Pull Request のプレビュー生成時 -> HTML生成＋デプロイ

if [ -n "$TRAVIS" ];  then
  echo "Travis でのビルドは廃止されました"
  exit 0
fi

if [ -n "$NETLIFY" ]; then 
  npm run fill-version
  npm run generate-download-page
  if [ $? -eq 1 ]; then
    echo "runtime error."
    exit 1
  fi
fi
