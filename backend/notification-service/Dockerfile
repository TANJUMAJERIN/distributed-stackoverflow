FROM node:alpine

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 5007

CMD ["node", "server.js"]