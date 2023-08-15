import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import * as cookieParser from "cookie-parser";
import * as https from "https";
import * as http from "http";
import * as express from "express";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as compression from "compression";
import { envSchema } from "@scholarsome/shared";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs";

async function bootstrap() {
  const validation = envSchema
      .prefs({ errors: { label: "key" } })
      .validate(process.env);

  if (validation.error) {
    console.error(
        "\x1b[31m" + "Configuration validation error: " + validation.error.message
    );
    process.exit(1);
  }

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        disableErrorMessages: process.env.NODE_ENV === "production"
      })
  );

  app.setGlobalPrefix("api", { exclude: ["assets/images/(.*)"] });

  app.use(cookieParser());
  app.use(compression());
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ limit: "30mb" }));

  if (
    process.env.SSL_KEY_BASE64 &&
    process.env.SSL_KEY_BASE64.length > 0 &&
    process.env.SSL_CERT_BASE64 &&
    process.env.SSL_CERT_BASE64.length > 0
  ) {
    https
        .createServer(
            {
              key: Buffer.from(process.env.SSL_KEY_BASE64, "base64").toString(),
              cert: Buffer.from(process.env.SSL_CERT_BASE64, "base64").toString()
            },
            server
        )
        .listen(8443);
  }

  const config = new DocumentBuilder().setTitle("Scholarsome").build();

  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync("./dist/api-spec.json", JSON.stringify(document));
  SwaggerModule.setup("api", app, document);

  const port = process.env.HTTP_PORT || 8080;
  await app.init();

  http.createServer(server).listen(port);
}

bootstrap();
