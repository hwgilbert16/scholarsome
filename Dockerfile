FROM node:18

ARG DB_STRING
ARG JWT_TOKEN

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --production --silent --legacy-peer-deps

COPY . .

RUN npm run generate
RUN npm run build

RUN touch .env

RUN echo "DATABASE_URL=$DB_STRING\n" >> .env
RUN echo "JWT_TOKEN=$JWT_TOKEN\n" >> .env

CMD [ "npm", "run", "serve" ]
