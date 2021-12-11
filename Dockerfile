FROM node:16

EXPOSE 8000

WORKDIR /app

RUN yarn install

COPY package.json yarn.lock ./

RUN yarn install 

COPY . .

CMD ["node", "api/api.js"]