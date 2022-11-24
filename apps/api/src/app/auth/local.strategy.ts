import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private configService: ConfigService) {
    super({
      usernameField: 'email',
      passReqToCallback: true
    });
  }

  async validate(req, email: string, password: string): Promise<boolean> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (this.configService.get<string>('RECAPTCHA_SECRET')) {
      const captchaCheck = await this.authService.validateRecaptcha((req.body as LoginDto).recaptchaToken);
      if (!captchaCheck) throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    return user;
  }
}
