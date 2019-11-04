#!/bin/sh

# リリーススクリプト
# - travis の master ブランチへのコミット時 -> 配布物生成 + 配布物コミット + push
# - netlify の master ブランチへのコミット時 -> 何もしない
# - netlify の Pull Request のプレビュー生成時 -> 配布物生成 (-> netlify にデプロイ) 

IS_PREVIEW=0

if [ -n "$TRAVIS" ];  then
  RELEASE_BRANCH=$TRAVIS_BRANCH
  git checkout $RELEASE_BRANCH
fi

if [ -n "$NETLIFY" ]; then 
  npm run fill-version
  if [ -z $PULL_REQUEST -o "$PULL_REQUEST" = false ]; then
    echo "[netlify master branch deploy] skip deploying new version."
    exit 0
  fi
  echo "[netlify PR preview deploy] preview mode"
  IS_PREVIEW=1
fi

npm run check-released --silent

if [ $? -eq 0 ]; then
  echo "[up to date] nothing to release."
  exit 0
fi

npm start
WWA_WING_VERSION=$(npm run print-version --silent)
cp -R ./output/wwawing-update/*.* ./wwawing.com/wing

if [ $IS_PREVIEW -eq 1 ]; then
  exit 0
fi

git add -A
git commit -m "[skip travis] RELEASED WWA Wing v$WWA_WING_VERSION"

if [ $? -eq 0 ]; then
  git push origin $RELEASE_BRANCH
fi
