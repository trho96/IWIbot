#!/bin/bash

# activate virtualenv
#source virtualenv/bin/activate
#echo "sourced"
# install requirements in virtualenv
#pip install -r requirements.txt --no-cache-dir
#echo "installed"

# deactivate virtualenv
#deactivate

# zip all
cd lib
echo "changed to lib"
zip -r action.zip *

# move to action root
mv action.zip ..
cd ..

# install zip in openwhisk
bx wsk action update test --kind python:3 action.zip --web true

# remove old
rm action.zip