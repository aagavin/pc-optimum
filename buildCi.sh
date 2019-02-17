#!/bin/bash
#
# "build": "npm run clean && export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true && npm install --production && npm install typescript --no-save && tsc && npm uninstall typescript",
#
curl https://github.com/adieuadieu/serverless-chrome/releases/download/v1.0.0-55/stable-headless-chromium-amazonlinux-2017-03.zip -o chromium.zip
unzip chromium.zip
npm run clean
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export NODE_ENV=production
npm ci --only=production
npm install typescript --no-save
tsc
npm uninstall typescript