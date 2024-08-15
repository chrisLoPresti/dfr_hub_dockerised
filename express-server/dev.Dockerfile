FROM node:latest

WORKDIR /express-server

COPY ./package.json ./
RUN npm install
COPY ./server.js ./

CMD ["npm","run","dev"]