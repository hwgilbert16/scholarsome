# syntax=docker/dockerfile:1.3-labs
FROM node:lts-alpine3.18

ARG NODE_ENV
ARG DATABASE_PASSWORD
ARG DATABASE_URL
ARG JWT_SECRET
ARG HTTP_PORT

ARG SMTP_HOST
ARG SMTP_PORT
ARG SMTP_USERNAME
ARG SMTP_PASSWORD
ARG HOST
ARG SSL_KEY_BASE64
ARG SSL_CERT_BASE64
ARG SCHOLARSOME_RECAPTCHA_SITE
ARG SCHOLARSOME_RECAPTCHA_SECRET

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --production --silent --legacy-peer-deps

COPY . .

RUN npm run generate
RUN npm run build

RUN <<EOL
    touch .env
    echo "NODE_ENV=$NODE_ENV\n" >> .env
    echo "DATABASE_PASSWORD=$DATABASE_PASSWORD\n" >> .env
    echo "DATABASE_URL=$DATABASE_URL\n" >> .env
    echo "JWT_SECRET=$JWT_SECRET\n" >> .env
    echo "HTTP_PORT=$HTTP_PORT\n" >> .env

    echo "S3_STORAGE_ENDPOINT=$S3_STORAGE_ENDPOINT\n" >> .env
    echo "S3_STORAGE_ACCESS_KEY=$S3_STORAGE_ACCESS_KEY\n" >> .env
    echo "S3_STORAGE_SECRET_KEY=$S3_STORAGE_SECRET_KEY\n" >> .env
    echo "S3_STORAGE_REGION=$S3_STORAGE_REGION\n" >> .env
    echo "S3_STORAGE_BUCKET=$S3_STORAGE_BUCKET\n" >> .env
    echo "SMTP_HOST=$SMTP_HOST\n" >> .env
    echo "SMTP_PORT=$SMTP_PORT\n" >> .env
    echo "SMTP_USERNAME=$SMTP_USERNAME\n" >> .env
    echo "SMTP_PASSWORD=$SMTP_PASSWORD\n" >> .env
    echo "HOST=$HOST\n" >> .env
    echo "SSL_KEY_BASE64=$SSL_KEY_BASE64\n" >> .env
    echo "SSL_CERT_BASE64=$SSL_CERT_BASE64\n" >> .env
    echo "SCHOLARSOME_RECAPTCHA_SITE=$SCHOLARSOME_RECAPTCHA_SITE\n" >> .env
    echo "SCHOLARSOME_RECAPTCHA_SECRET=$SCHOLARSOME_RECAPTCHA_SECRET\n" >> .env
    echo "REDIS_HOST=$REDIS_HOST" >> .env
    echo "REDIS_PORT=$REDIS_PORT" >> .env
    echo "REDIS_USERNAME=$REDIS_USERNAME" >> .env
    echo "REDIS_PASSWORD=$REDIS_PASSWORD" >> .env
EOL

CMD [ "npm", "run", "serve:node" ]
