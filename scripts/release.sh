#!/bin/sh

if [ -n "$NETLIFY" ]; then 
  npm start
  if [ $? -eq 1 ]; then
    echo "runtime error."
    exit 1
  fi
fi
