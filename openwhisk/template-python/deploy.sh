#!/bin/bash

# remove old
rm action.zip
cd lib
# zip all
zip -r action.zip *
# move to action root
mv action.zip ..
cd ..

# install zip in openwhisk
bx wsk action update test --kind python:3 action.zip --web true
