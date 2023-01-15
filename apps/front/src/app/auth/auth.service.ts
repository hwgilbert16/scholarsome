import { Injectable } from '@angular/core';
import {
  LoginForm,
  LoginFormCaptcha,
  RegisterForm,
  RegisterFormCaptcha,
  ResetForm,
  SubmitResetForm
} from "../shared/models/Auth";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { lastValueFrom, shareReplay } from "rxjs";
import { ReCaptchaV3Service } from "ng-recaptcha";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private recaptchaV3Service: ReCaptchaV3Service) {}

  async submitResetPassword(submitResetForm: SubmitResetForm): Promise<number> {
    let req;

    try {
      req = await lastValueFrom(this.http.get('/api/auth/reset/password/' + submitResetForm.email, { observe: 'response' }));
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        return e.status;
      } else {
        return 500;
      }
    }

    return req.status;
  }

  async setPassword(resetForm: ResetForm): Promise<number> {
    let req;

    try {
      req = await lastValueFrom(this.http.post<ResetForm>('/api/auth/reset/password', resetForm, { observe: 'response' }));
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        return e.status;
      } else {
        return 500;
      }
    }

    return req.status;
  }

  async login(loginForm: LoginForm): Promise<number> {
    const body: LoginFormCaptcha = {
      ...loginForm,
      recaptchaToken: await lastValueFrom(this.recaptchaV3Service.execute('login'))
    };

    let req;

    try {
      req = await lastValueFrom(this.http.post<LoginFormCaptcha>('/api/auth/login', body, { observe: 'response' }));
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        return e.status;
      } else {
        return 500;
      }
    }

    return req.status;
  }

  async register(registerForm: RegisterForm): Promise<number> {
    const body: RegisterFormCaptcha = {
      ...registerForm,
      recaptchaToken: await lastValueFrom(this.recaptchaV3Service.execute('register'))
    };

    let req;

    try {
      req = await lastValueFrom(this.http.post<RegisterFormCaptcha>('/api/auth/register', body, { observe: 'response' }));
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        return e.status;
      } else {
        return 500;
      }
    }

    return req.status;
  }

  logout() {
    return this.http.post('/api/auth/logout', {}).pipe(shareReplay());
  }
}
