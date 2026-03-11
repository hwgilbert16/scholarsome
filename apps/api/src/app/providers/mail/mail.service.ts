import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Sends an email confirmation to verify an address
   *
   * @param email Email address to send the verification to
   *
   * @returns Whether the email successfully sent
   */
  async sendEmailConfirmation(email: string): Promise<boolean> {
    if (
      !this.configService.get<boolean>("SMTP_USERNAME") ||
      !this.configService.get<boolean>("SMTP_PASSWORD")
    ) return false;

    const token = this.jwtService.sign({ email });

    await this.mailerService.sendMail({
      to: email,
      from: "noreply@scholarsome.com",
      subject: "Confirmer votre Email",
      text: `Bonjour,\n\nMerci de confirmer votre adresse E-mail. En cliquant sur le lien suivant :\n\nhttp${this.configService.get<string>("SSL_KEY_PATH") ? "s" : ""}://${this.configService.get<string>("HOST")}/api/auth/verify/email/${token}\n\n\nRespectueusement.`
    });

    return true;
  }

  /**
   * Sends a password reset email
   *
   * @param email Email address to send the reset to
   *
   * @returns Whether the email successfully sent
   */
  async sendPasswordReset(email: string) {
    if (
      !this.configService.get<boolean>("SMTP_USERNAME") ||
      !this.configService.get<boolean>("SMTP_PASSWORD")
    ) {
      return;
    }

    const token = this.jwtService.sign({ email, forPasswordReset: true }, { expiresIn: "10m" });

    await this.mailerService.sendMail({
      to: email,
      from: "noreply@scholarsome.com",
      subject: "Reset your password",
      text: `Bonjour,\n\nSi vous n’avez pas demandé de changement de mot de passe, vous pouvez ignorer cet e-mail.\n\nVous recevez ce message parce que vous avez demandé une réinitialisation de votre mot de passe. Suivez le lien ci-dessous pour choisir un nouveau mot de passe.\n\nCe lien expirera dans 10 minutes.\n\nhttp${this.configService.get<string>("SSL_KEY_BASE64") ? "s" : ""}://${this.configService.get<string>("HOST")}/api/auth/reset/password/verify/${token}`
    });
  }
}
