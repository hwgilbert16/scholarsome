import { Injectable } from "@angular/core";
import {
  ApiResponse,
  ApiResponseOptions,
  LoginForm,
  RegisterForm,
  ResetForm,
  SubmitResetForm
} from "@scholarsome/shared";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
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
  async sendPasswordReset(submitResetForm: SubmitResetForm): Promise<string> {
    const req = await lastValueFrom(this.http.get<ApiResponse<User>>("/api/auth/reset/sendReset/" + submitResetForm.email, { observe: "response" }));

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
    const req = await lastValueFrom(this.http.post<ApiResponse<null>>("/api/auth/reset/setPassword", { password: resetForm.password }, { observe: "response" }));

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
  async login(loginForm: LoginForm): Promise<ApiResponseOptions> {
    const body: LoginForm = {
      ...loginForm
    };

    if (process.env["SCHOLARSOME_RECAPTCHA_SECRET"]) {
      body.recaptchaToken = await lastValueFrom(this.recaptchaV3Service.execute("login"));
    }

    let login: HttpResponse<ApiResponse<null>>;

    try {
      login = await lastValueFrom(this.http.post<ApiResponse<null>>("/api/auth/login", body, { observe: "response" }));

      if (login.status === 429) {
        return ApiResponseOptions.Ratelimit;
      } else if (login.status === 401) {
        return ApiResponseOptions.Incorrect;
      } else if (login.body && login.body.status === "success") {
        return ApiResponseOptions.Success;
      } else return ApiResponseOptions.Error;
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        switch (e.status) {
          case 401:
            return ApiResponseOptions.Incorrect;
          case 500:
            return ApiResponseOptions.Error;
        }
      }

      return ApiResponseOptions.Error;
    }
  }

  /**
   * Makes a request to register a user
   *
   * @param registerForm `RegisterForm` object
   *
   * @returns HTTP status of request
   */
  async register(registerForm: RegisterForm): Promise<ApiResponseOptions> {
    const body: RegisterForm = {
      ...registerForm
    };

    if (process.env["SCHOLARSOME_RECAPTCHA_SECRET"]) {
      body.recaptchaToken = await lastValueFrom(this.recaptchaV3Service.execute("register"));
    }

    let register: HttpResponse<ApiResponse<{ confirmEmail: boolean }>>;

    try {
      register = await lastValueFrom(this.http.post<ApiResponse<{ confirmEmail: boolean }>>("/api/auth/register", body, { observe: "response" }));

      if (
        register.body &&
        register.body.status === "success" &&
        register.body.data.confirmEmail
      ) {
        return ApiResponseOptions.Verify;
      } else if (
        register.body &&
        register.body.status === "success"
      ) {
        return ApiResponseOptions.Success;
      } else return ApiResponseOptions.Error;
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        switch (e.status) {
          case 429:
            return ApiResponseOptions.Ratelimit;
          case 409:
            return ApiResponseOptions.Exists;
        }
      }
    }

    return ApiResponseOptions.Error;
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
