import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailConfig } from './mail.config';
import { MailService } from './mail.service';
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MailConfig,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_TOKEN'),
        signOptions: { expiresIn: '14d' },
      }),
      inject: [ConfigService],
    })
  ],
  providers: [MailConfig, MailService],
  exports: [MailService],
})
export class MailModule {}
