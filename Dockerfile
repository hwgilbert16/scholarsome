FROM node:18

ARG NODE_ENV
ARG DATABASE_PASSWORD
ARG DATABASE_URL
ARG JWT_TOKEN

ARG SMTP_HOST
ARG SMTP_PORT
ARG SMTP_USERNAME
ARG SMTP_PASSWORD
ARG HOST
ARG SSL_KEY_PATH
ARG SSL_CERT_PATH
ARG RECAPTCHA_SITE
ARG RECAPTCHA_SECRET

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --production --silent --legacy-peer-deps

COPY . .

RUN npm run generate
RUN npm run build

RUN touch .env

RUN echo "NODE_ENV=$NODE_ENV\n" >> .env
RUN echo "DATABASE_PASSWORD=$DATABASE_PASSWORD\n" >> .env
RUN echo "DATABASE_URL=$DATABASE_URL\n" >> .env
RUN echo "JWT_TOKEN=$JWT_TOKEN\n" >> .env

RUN echo "SMTP_HOST=$SMTP_HOST\n" >> .env
RUN echo "SMTP_PORT=$SMTP_PORT\n" >> .env
RUN echo "SMTP_USERNAME=$SMTP_USERNAME\n" >> .env
RUN echo "SMTP_PASSWORD=$SMTP_PASSWORD\n" >> .env
RUN echo "HOST=$HOST\n" >> .env
RUN echo "SSL_KEY_PATH=$SSL_KEY_PATH\n" >> .env
RUN echo "SSL_CERT_PATH=$SSL_CERT_PATH\n" >> .env
RUN echo "RECAPTCHA_SITE=$RECAPTCHA_SITE\n" >> .env
RUN echo "RECAPTCHA_SECRET=$RECAPTCHA_SECRET\n" >> .env

CMD [ "npm", "run", "serve" ]
