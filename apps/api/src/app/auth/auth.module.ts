import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigService } from "@nestjs/config";
import { DatabaseModule } from "../providers/database/database.module";
import { MailModule } from "../providers/mail/mail.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { HttpModule } from "@nestjs/axios";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_TOKEN"),
        signOptions: { expiresIn: "14d" }
      }),
      inject: [ConfigService]
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    MailModule,
    HttpModule,
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
