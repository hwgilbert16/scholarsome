import { Injectable } from '@angular/core';
import { LoginForm, LoginFormCaptcha, RegisterForm } from "../shared/models/Auth";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { lastValueFrom, shareReplay } from "rxjs";
import { ReCaptchaV3Service } from "ng-recaptcha";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private recaptchaV3Service: ReCaptchaV3Service) { }

  async login(loginForm: LoginForm): Promise<HttpResponse<LoginFormCaptcha> | Promise<null>> {
    const body: LoginFormCaptcha = {
      ...loginForm,
      recaptchaToken: await lastValueFrom(this.recaptchaV3Service.execute('login'))
    }

    let req;

    try {
      req = await lastValueFrom(this.http.post<LoginFormCaptcha>('/api/auth/login', body, { observe: 'response' }));
    } catch (e) {
      console.log(e);
      return null;
    }

    return req;
  }

  register(registerForm: RegisterForm) {
    return this.http.post<RegisterForm>('/api/auth/register', registerForm, { observe: 'response' }).pipe(shareReplay());
  }

  logout() {
    return this.http.post('/api/auth/logout', {}).pipe(shareReplay());
  }
}
