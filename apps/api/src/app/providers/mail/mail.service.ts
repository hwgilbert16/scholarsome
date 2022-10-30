import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailConfirmation(email: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'noreply@scholarsome.com',
      subject: 'Confirm your email address',
      text: 'Welcome to Scholarsome! Before getting started, we need to confirm your email address.'
    });
  }
}
