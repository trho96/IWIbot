#!/bin/bash
# preserve dev deps if any
mkdir -p .mod
mv node_modules .mod
# install only prod deps
npm install --production  > /dev/null
# zip all but skip the dev deps
zip -rq action.zip package.json lib/Meal.js node_modules
# delete prod deps
rm -rf node_modules
# recover dev deps
mv .mod node_modules
# install zip in openwhisk
bx wsk action update testNavigation --kind nodejs:6 action.zip --web true
bx wsk api create $API_TEST_PATH /navigation get testNavigation --response-type json