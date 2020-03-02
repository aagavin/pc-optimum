From FROM node:slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm run build

COPY . .
