#!/bin/sh

npm run check-released --silent

if [ $? -eq 1 ]; then
    npm start
else
    echo "nothing to release."
fi
