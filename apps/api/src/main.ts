import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, disableErrorMessages: true }));

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const port = process.env.PORT || 3333;
  await app.listen(port);
}

bootstrap();
