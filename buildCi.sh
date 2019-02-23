#!/bin/bash
#
# "build": "npm run clean && export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true && npm install --production && npm install typescript --no-save && tsc && npm uninstall typescript",
# "package": "npm run build && zip -r lambda.zip node_modules && cd ./build && zip -ru ../lambda.zip . && cd .. && zip -ju lambda.zip ./headless-chromium",
#


#
# varables
#
chromefile="chromium.zip"
chromebin="headless-chromium"
zipfile="lambda.zip"

#
# compile
#
npm run clean
if [ ! -f "$chromebin" ]; then
  echo "chome bin not found... downloading"
  curl -L https://github.com/adieuadieu/serverless-chrome/releases/download/v1.0.0-55/stable-headless-chromium-amazonlinux-2017-03.zip -o $chromefile
  unzip $chromefile
  
fi
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export NODE_ENV=production
npm ci --only=production
# npm -g install typescript
npx -p typescript tsc
for jsfile in "build"/*.js
do
  npx uglify-es --compress --mangle -o ./"$jsfile" -- ./"$jsfile"
done

#
# package
#
zip -r $zipfile node_modules
cd ./build
zip -ru ../$zipfile *.js
cd ..
zip -ju $zipfile ./headless-chromium
