#!/bin/bash
#
# "build": "npm run clean && export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true && npm install --production && npm install typescript --no-save && tsc && npm uninstall typescript",
# "package": "npm run build && zip -r lambda.zip node_modules && cd ./build && zip -ru ../lambda.zip . && cd .. && zip -ju lambda.zip ./headless-chromium",
#


# 
# varables
# 
chromefile="chromium.zip"
zipfile="lambda.zip"

# 
# compile
# 
npm run clean
curl -L https://github.com/adieuadieu/serverless-chrome/releases/download/v1.0.0-55/stable-headless-chromium-amazonlinux-2017-03.zip -o $chromefile
unzip $chromefile
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export NODE_ENV=production
npm ci --only=production
# npm -g install typescript
npx -p typescript tsc

#
# package
# 
zip -r $zipfile node_modules
cd ./build
zip -ru ../$zipfile .
cd ..
zip -ju $zipfile ./headless-chromium
