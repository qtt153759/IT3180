FROM node:16

EXPOSE 3000

WORKDIR /app

RUN npm i npm@latest -g

COPY package.json yarn.lock ./

RUN yarn install 

COPY . .