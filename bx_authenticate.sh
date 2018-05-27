#!/bin/bash
# Login requiered to provision the API Gateway
source local.env
bx login -a "$API_ENDPOINT" --apikey "$API_KEY" \
    -o "$BLUEMIX_ORGANIZATION" -s "$BLUEMIX_SPACE" \
    -c "$BLUEMIX_ACCOUNT_ID"
# target org in cf
bx target --cf "$BLUEMIX_ORGANIZATION"
#retrieve token
bx iam oauth-tokens
# install wsk plugin for the bluemix cli
bx plugin install Cloud-Functions -r Bluemix