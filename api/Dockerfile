FROM node:15.14.0-alpine3.10
COPY . /app
WORKDIR /app
RUN npm install
RUN apk update
RUN apk add imagemagick
RUN apk add redis
