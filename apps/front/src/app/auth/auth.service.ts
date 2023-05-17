import { Injectable } from "@angular/core";
import {
  ApiResponse,
  LoginForm,
  LoginFormCaptcha,
  RegisterForm,
  RegisterFormCaptcha,
  ResetForm,
  SubmitResetForm
} from "@scholarsome/shared";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { User } from "@prisma/client";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  /**
   * @ignore
   */
  constructor(private http: HttpClient, private recaptchaV3Service: ReCaptchaV3Service) {}


  /**
   * Makes a request to submit a password reset based on information from `SubmitResetForm`
   *
   * @param submitResetForm `SubmitResetForm` object
   *
   * @returns HTTP response of request
   */
  async submitResetPassword(submitResetForm: SubmitResetForm): Promise<string> {
    const req = await lastValueFrom(this.http.get<ApiResponse<User>>("/api/auth/reset/password/" + submitResetForm.email, { observe: "response" }));

    if (req.status === 429) {
      return "ratelimit";
    } else if (req.body) {
      return req.body.status;
    } else return "error";
  }

  /**
   * Makes a request to update the password of a user based on information from `ResetForm`
   *
   * @param resetForm `ResetForm` object
   *
   * @returns HTTP status of request
   */
  async setPassword(resetForm: ResetForm): Promise<string> {
    const req = await lastValueFrom(this.http.post<ApiResponse<null>>("/api/auth/reset/password", resetForm, { observe: "response" }));

    if (req.status === 429) {
      return "ratelimit";
    } else if (req.body) {
      return req.body.status;
    } else return "error";
  }

  /**
   * Makes a request to log in a user
   *
   * @param loginForm `LoginForm` object
   *
   * @returns HTTP status of request
   */
  async login(loginForm: LoginForm): Promise<number> {
    const body: LoginFormCaptcha = {
      ...loginForm,
      recaptchaToken: await lastValueFrom(this.recaptchaV3Service.execute("login"))
    };

    let req;

    try {
      req = await lastValueFrom(this.http.post<LoginFormCaptcha>("/api/auth/login", body, { observe: "response" }));
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        return e.status;
      } else {
        return 500;
      }
    }

    return req.status;
  }

  /**
   * Makes a request to register a user
   *
   * @param registerForm `RegisterForm` object
   *
   * @returns HTTP status of request
   */
  async register(registerForm: RegisterForm): Promise<number> {
    const body: RegisterFormCaptcha = {
      ...registerForm,
      recaptchaToken: await lastValueFrom(this.recaptchaV3Service.execute("register"))
    };

    let req;

    try {
      req = await lastValueFrom(this.http.post<RegisterFormCaptcha>("/api/auth/register", body, { observe: "response" }));
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        return e.status;
      } else {
        return 500;
      }
    }

    return req.status;
  }

  /**
   * Makes a request to logout a user
   *
   * @returns Response object of the request
   */
  async logout() {
    return await lastValueFrom(this.http.post("/api/auth/logout", {}));
  }
}
