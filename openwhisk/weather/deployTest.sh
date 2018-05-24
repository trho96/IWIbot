#!/usr/bin/env bash
# preserve dev deps if any
mkdir -p .mod
mv node_modules .mod
# install only prod deps
npm install --production  > /dev/null
# zip all but skip the dev deps
zip -rq action.zip package.json lib/Weather.js node_modules
# delete prod deps
rm -rf node_modules
# recover dev deps
mv .mod node_modules
# install zip in openwhisk
bx wsk action create testWeather --kind nodejs:6 action.zip --web true
bx wsk service bind weatherinsights testWeather
bx wsk api create $API_BASE_PATH /weather post testWeather --response-type json