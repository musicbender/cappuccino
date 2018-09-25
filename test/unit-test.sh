#!/bin/bash

mocha \
  --compilers js:babel-core/register \
  $(find src test -name '*.test.js'  -not -path 'node_modules/*' -not -path 'src/global-func-tests/*')
