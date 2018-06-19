#!/bin/bash
# This script is also for any kind of executables.
# Just build the binary and create the action with --native flag
# I think you have to call the executable "exec"..
# So just call it like that and everything should be fine

cd lib
# build the go action binary
GOOS=linux GOARCH=amd64 go build -o exec
# zip the binary
zip -r action.zip exec

# install the go action
bx wsk action update test --native action.zip

# clean up
rm action.zip
rm exec