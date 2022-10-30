import { Module } from '@nestjs/common';
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigService } from "@nestjs/config";
import { DatabaseModule } from "../providers/database/database.module";
import { SelfStrategy } from "./self.strategy";
import { MailModule } from "../providers/mail/mail.module";

@Module({
  /*
  TODO: Change to access/refresh token architecture
  This is only temporary
   */
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_TOKEN'),
        signOptions: { expiresIn: '14d' },
      }),
      inject: [ConfigService],
    }),
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, SelfStrategy],
  exports: [AuthService],
})
export class AuthModule {}
