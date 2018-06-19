#!/bin/bash

# zip all
zip -rq action.zip package.json lib node_modules

# install zip in openwhisk
bx wsk action update testTest--kind python:3 action.zip --web true
bx wsk api create -n "iwibot Test API" $API_TEST_PATH /test post testTest --response-type json