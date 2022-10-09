import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './providers/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CreateController } from './create/create.controller';
import { CreateModule } from './create/create.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'dist', 'apps', 'front'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    CreateModule,
  ],
  controllers: [AuthController, CreateController],
  providers: [],
})
export class AppModule {}
