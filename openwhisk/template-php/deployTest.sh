#!/usr/bin/env bash

cd lib
# zip all but skip the dev deps
zip -rq action.zip *

# install zip in openwhisk
bx wsk action update testTest--kind php:7.1 action.zip --web true
bx wsk api create -n "iwibot Test API" $API_TEST_PATH /test get testTest --response-type json