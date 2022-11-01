import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private jwtService: JwtService) {}

  async sendEmailConfirmation(email: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'noreply@scholarsome.com',
      subject: 'Confirm your email address',
      text: `Hey there,\n\nWelcome to Scholarsome! We're glad to have you here. Before getting started, we need to confirm your email address.\n\nTo confirm your email, please click this link:\n\n${this.jwtService.sign({ email })}`
    });
  }
}
