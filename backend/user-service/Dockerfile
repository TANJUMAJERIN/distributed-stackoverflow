
FROM node:alpine

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 5005

CMD ["node", "server.js"]