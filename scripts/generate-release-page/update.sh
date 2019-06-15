#!/bin/sh

cd `dirname $0`
rm -rf node_modules
npm i
node add-release $1
node generate-page

