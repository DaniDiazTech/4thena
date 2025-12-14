FROM node:24.8.0-alpine3.22 AS builder

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
