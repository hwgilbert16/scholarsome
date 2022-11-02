import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async sendEmailConfirmation(email: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'noreply@scholarsome.com',
      subject: 'Confirm your email address',
      text: `Hey there,\n\n
      Welcome to Scholarsome! We're glad to have you here. Before getting started, we need to confirm your email address.\n\
      nTo confirm your email, please click this link:\n\n
      http${this.configService.get<string>('SSL_KEY_PATH') ? 's' : ''}://${this.configService.get<string>('HOST')}/api/auth/verify/${this.jwtService.sign({ email })}`
    });
  }
}
