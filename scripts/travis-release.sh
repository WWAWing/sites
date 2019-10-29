#!/bin/sh

npm run check-released --silent

if [ $? -eq 1 ]; then
    git checkout $TRAVIS_BRANCH
    npm start
    WWA_WING_VERSION=$(npm run print-version --silent)
    echo "{\"version\":\"$WWA_WING_VERSION\"}" > ./wwawing.com/latest-version.json 
    git add -A
    git commit -m "RELEASED WWA Wing v$WWA_WING_VERSION"
    if [ $? -eq 0 ]; then
      git push origin $TRAVIS_BRANCH
    fi
else
    echo "nothing to release."
fi
