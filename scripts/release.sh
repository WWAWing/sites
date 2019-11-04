#!/bin/sh

# リリーススクリプト
# - travis の master ブランチへのコミット時 -> 配布物生成 + 配布物コミット + push
# - netlify の master ブランチへのコミット時 -> 何もしない
# - netlify の Pull Request のプレビュー生成時 -> 配布物生成 (-> netlify にデプロイ) 

if [ $TRAVIS ]; then
  RELEASE_BRANCH=$TRAVIS_BRANCH
  git checkout $RELEASE_BRANCH
fi

if [ $NETLIFY ]; then 
  if [ $PULL_REQUEST ]; then
    echo "[preview mode]"
    IS_PREVIEW=1
  else
    echo "nothing to deploy."
    exit 0
  fi
fi

npm run check-released --silent

if [ $? -eq 0 ]; then
  echo "nothing to release."
  exit 0
fi

npm start
WWA_WING_VERSION=$(npm run print-version --silent)
echo "{\"version\":\"$WWA_WING_VERSION\"}" > ./wwawing.com/latest-version.json 
cp -R ./output/wwawing-update/*.* ./wwawing.com/wing

if [ $IS_PREVIEW ]; then
  exit 0
fi

git add -A
git commit -m "[skip travis] RELEASED WWA Wing v$WWA_WING_VERSION"

if [ $? -eq 0 ]; then
  git push origin $RELEASE_BRANCH
fi
