FROM node:12

RUN mkdir /angularjsclient
WORKDIR /angularjsclient

COPY package*.json ./

RUN npm install

COPY . .