FROM node:18-bullseye
RUN curl https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian11-x86_64-100.6.1.deb --output /tmp/tools.deb
RUN apt update -y && apt install -y /tmp/tools.deb
ENV NODE_ENV production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn link
CMD yarn start cron