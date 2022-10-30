import { Injectable } from "@nestjs/common";
import { MailerOptions, MailerOptionsFactory } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailConfig implements MailerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.configService.get<string>('SMTP_HOST'),
        port: this.configService.get<number>('SMTP_PORT'),
        auth: {
          user: this.configService.get<string>('SMTP_USERNAME'),
          pass: this.configService.get<string>('SMTP_PASSWORD'),
        },
      },
      defaults: {
        from: '"Scholarsome" <noreply@scholarsome.com>',
      },
    }
  }
}
