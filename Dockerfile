FROM node:18

WORKDIR /usr/src/app

COPY package*.json /usr/src/app

RUN npm install --production --silent --legacy-peer-deps

COPY ./ /usr/src/app

RUN npm run generate

RUN npm run build

RUN echo ls

CMD [ "node", "dist/apps/api/main.js" ]

EXPOSE 3333
