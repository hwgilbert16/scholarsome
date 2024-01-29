import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { AccessTokenStrategy } from "./guards/accessToken.strategy";
import { DatabaseModule } from "../providers/database/database.module";
import { MailModule } from "../providers/mail/mail.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { HttpModule } from "@nestjs/axios";
import { UsersModule } from "../users/users.module";
import { ApiKeyStrategy } from "./guards/apiKey.strategy";

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    ThrottlerModule.forRoot(),
    MailModule,
    HttpModule,
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, ApiKeyStrategy],
  exports: [AuthService]
})
export class AuthModule {}
