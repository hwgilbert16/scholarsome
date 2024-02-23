import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
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
import { MediaModule } from "./media/media.module";
import { TokenRefreshMiddleware } from "./providers/token-refresh.middleware";
import { ConvertingModule } from "./converting/converting.module";
import { StorageModule } from "./providers/storage/storage.module";
import { APP_FILTER } from "@nestjs/core";
import { CommonHttpExceptionFilter } from "./shared/exception/filters/common-http-exception.filter";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "front"),
      serveStaticOptions: {
        cacheControl: true,
        maxAge: 31536000,
      },
      exclude: ["/api/(.*)", "/handbook/(.*)"],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "docs"),
      serveRoot: "/handbook",
      serveStaticOptions: {
        cacheControl: true,
        maxAge: 31536000,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        defaultOptions: {
          host: configService.get<string>("REDIS_HOST"),
          port: configService.get<number>("REDIS_PORT"),
          username: configService.get<string>("REDIS_USERNAME"),
          password: configService.get<string>("REDIS_PASSWORD"),
        },
        config: [
          {
            namespace: "apiToken",
            keyPrefix: "apiToken&",
            name: "apiToken",
          },
          {
            namespace: "default",
          },
        ],
      }),
    }),
    AuthModule,
    DatabaseModule,
    SetsModule,
    MailModule,
    StorageModule,
    CardsModule,
    UsersModule,
    MediaModule,
    {
      ...JwtModule.registerAsync({
        useFactory: (configService: ConfigService) => ({
          secret: configService.get("JWT_SECRET"),
          signOptions: { expiresIn: "14d" },
        }),
        inject: [ConfigService],
      }),
      global: true,
    },
    ConvertingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CommonHttpExceptionFilter,
    },
  ],
  exports: [JwtModule],
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

    consumer
      .apply(TokenRefreshMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
