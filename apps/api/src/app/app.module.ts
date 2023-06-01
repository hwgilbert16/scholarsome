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

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "front")
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
    AuthModule,
    DatabaseModule,
    SetsModule,
    MailModule,
    CardsModule,
    UsersModule,
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
