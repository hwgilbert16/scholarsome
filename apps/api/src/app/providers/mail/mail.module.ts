import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule } from "@nestjs/config";
import { MailConfig } from "./mail.config";
import { MailService } from "./mail.service";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MailConfig
    })
  ],
  providers: [MailConfig, MailService],
  exports: [MailService]
})
export class MailModule {}
