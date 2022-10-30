import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './providers/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SetsModule } from './sets/sets.module';
import { MailModule } from './providers/mail/mail.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'front'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    SetsModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
