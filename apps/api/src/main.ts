import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import * as https from 'https';
import * as http from "http";
import * as express from 'express';
import { ExpressAdapter } from "@nestjs/platform-express";

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, disableErrorMessages: process.env.NODE_ENV === 'production' }));

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  if (
    process.env.SSL_KEY_BASE64 && process.env.SSL_KEY_BASE64.length > 0
    &&
    process.env.SSL_CERT_BASE64 && process.env.SSL_CERT_BASE64.length > 0
  ) {
    https.createServer({
      key: Buffer.from(process.env.SSL_KEY_BASE64, 'base64').toString(),
      cert: Buffer.from(process.env.SSL_CERT_BASE64, 'base64').toString()
    }, server).listen(8443);
  }

  const port = process.env.HTTP_PORT || 8080;
  await app.init();

  http.createServer(server).listen(port);
}

bootstrap();
