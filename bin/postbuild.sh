#!/bin/bash

rm -rf ./.amplify-hosting

mkdir -p ./.amplify-hosting/compute

cp -r ./dist ./.amplify-hosting/compute/default
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules

cp -r public ./.amplify-hosting/static 2>/dev/null || echo "No public directory found, skipping static files"

cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json

cp -r ./src/config ./.amplify-hosting/compute/default 2>/dev/null || echo "No config directory found"
cp -r ./src/controllers ./.amplify-hosting/compute/default 2>/dev/null || echo "No controllers directory found"
cp -r ./src/models ./.amplify-hosting/compute/default 2>/dev/null || echo "No models directory found"
cp -r ./src/routes ./.amplify-hosting/compute/default 2>/dev/null || echo "No routes directory found"