#!/bin/bash

cd lib
# zip all in lib directory
zip -r action.zip *

# install zip in openwhisk
bx wsk action update test --kind php:7.1 action.zip

# clean up
rm action.zip