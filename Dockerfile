FROM node:18

ARG DB_STRING
ARG JWT_TOKEN

ARG GENERATED_DB_PASSWORD=$("node ./tools/build/envGenerator.js")
ARG GENERATED_JWT_TOKEN=$("node ./tools/build/envGenerator.js")

RUN if [[ -z "$DB_STRING" ]] ; then echo "DB_STRING is required" && exit 1 ; fi

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --production --silent --legacy-peer-deps

COPY . .

RUN npm run generate
RUN npm run build

RUN touch .env

RUN echo "DATABASE_URL=$DB_STRING\n" >> .env
RUN if [[ -n "$JWT_TOKEN" ]] ; then echo "JWT_TOKEN=$JWT_TOKEN\n" >> .env ; else echo "JWT_TOKEN=$GENERATED_JWT_TOKEN" ; fi

CMD [ "npm", "run", "serve" ]
