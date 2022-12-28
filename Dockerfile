FROM node:18-alpine
RUN apk add mongodb-tools
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
CMD node index.js