import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./providers/database/database.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SetsModule } from "./sets/sets.module";
import { MailModule } from "./providers/mail/mail.module";
import { HttpsRedirectMiddleware } from "./providers/https-redirect.middleware";
import { CardsModule } from "./cards/cards.module";
import { UsersModule } from "./users/users.module";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { JwtModule } from "@nestjs/jwt";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GlobalInterceptor } from "./auth/global.interceptor";
import { S3Module } from "nestjs-s3";
import { MediaModule } from "./media/media.module";
import { getS3Module } from "./providers/getS3Module";

const imports = [
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, "..", "front"),
    serveStaticOptions: {
      cacheControl: true,
      maxAge: 31536000
    },
    exclude: ["/api/(.*)"]
  }),
  ConfigModule.forRoot({
    isGlobal: true
  }),
  RedisModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      config: {
        host: configService.get<string>("REDIS_HOST"),
        port: configService.get<number>("REDIS_PORT"),
        username: configService.get<string>("REDIS_USERNAME"),
        password: configService.get<string>("REDIS_PASSWORD")
      }
    })
  }),
  S3Module.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      config: {
        credentials: {
          accessKeyId: configService.get<string>("S3_STORAGE_ACCESS_KEY"),
          secretAccessKey: configService.get<string>("S3_STORAGE_SECRET_KEY")
        },
        region: configService.get<string>("S3_STORAGE_REGION"),
        endpoint: configService.get<string>("S3_STORAGE_ENDPOINT")
      }
    })
  }),
  AuthModule,
  DatabaseModule,
  SetsModule,
  MailModule,
  CardsModule,
  UsersModule,
  MediaModule,
  {
    ...JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: "14d" }
      }),
      inject: [ConfigService]
    }),
    global: true
  }
];

if (
  process.env["STORAGE_TYPE"] === "s3" ||
  process.env["STORAGE_TYPE"] === "S3"
) imports.push(getS3Module());

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "front"),
      serveStaticOptions: {
        cacheControl: true,
        maxAge: 31536000
      },
      exclude: ["/api/(.*)"]
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get<string>("REDIS_HOST"),
          port: configService.get<number>("REDIS_PORT"),
          username: configService.get<string>("REDIS_USERNAME"),
          password: configService.get<string>("REDIS_PASSWORD")
        }
      })
    }),
    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          credentials: {
            accessKeyId: configService.get<string>("S3_STORAGE_ACCESS_KEY"),
            secretAccessKey: configService.get<string>("S3_STORAGE_SECRET_KEY")
          },
          region: configService.get<string>("S3_STORAGE_REGION"),
          endpoint: configService.get<string>("S3_STORAGE_ENDPOINT")
        }
      })
    }),
    AuthModule,
    DatabaseModule,
    SetsModule,
    MailModule,
    CardsModule,
    UsersModule,
    MediaModule,
    {
      ...JwtModule.registerAsync({
        useFactory: (configService: ConfigService) => ({
          secret: configService.get("JWT_SECRET"),
          signOptions: { expiresIn: "14d" }
        }),
        inject: [ConfigService]
      }),
      global: true
    }
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor
    }
  ],
  exports: [JwtModule]
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    if (
      this.configService.get<string>("NODE_ENV") === "production" &&
      this.configService.get<string>("SSL_KEY_PATH") &&
      this.configService.get<string>("SSL_KEY_PATH").length > 0
    ) {
      consumer
          .apply(HttpsRedirectMiddleware)
          .forRoutes({ path: "*", method: RequestMethod.ALL });
    }
  }
}
