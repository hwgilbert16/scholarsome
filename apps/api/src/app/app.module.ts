import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './providers/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SetsModule } from './sets/sets.module';
import { MailModule } from './providers/mail/mail.module';
import { HttpsRedirectMiddleware } from './providers/https-redirect.middleware';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'front')
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    DatabaseModule,
    SetsModule,
    MailModule
  ],
  controllers: [AuthController],
  providers: []
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer): any {
    if (
      this.configService.get<string>('NODE_ENV') === 'production' &&
      this.configService.get<string>('SSL_KEY_PATH') &&
      this.configService.get<string>('SSL_KEY_PATH').length > 0
    ) {
      consumer
        .apply(HttpsRedirectMiddleware)
        .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
  }
}
