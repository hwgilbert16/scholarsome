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
  constructor(private http: HttpClient, private recaptchaV3Service: ReCaptchaV3Service) {}

  /**
   * Makes a request to change the password of a user that is already authenticated
   *
   * @param newEmail The new email address
   *
   * @returns HTTP sttus of the request
   */
  async setEmail(newEmail: string): Promise<ApiResponseOptions> {
    const req = await lastValueFrom(this.http.post<ApiResponse<User>>("/api/auth/reset/email/set", { newEmail: newEmail }, { observe: "response" }));

    if (req.status === 429) {
      return ApiResponseOptions.Ratelimit;
    } else if (req.body) {
      return ApiResponseOptions.Success;
    } else return ApiResponseOptions.Fail;
  }

  /**
   * Makes a request to update the password of a user based on information from `ResetForm`
   *
   * @param resetForm `ResetForm` object
   *
   * @returns HTTP status of request
   */
  async setPassword(resetForm: ResetForm): Promise<string> {
    const req = await lastValueFrom(this.http.post<ApiResponse<null>>("/api/auth/reset/password/set", { newPassword: resetForm.password }, { observe: "response" }));

    if (req.status === 429) {
      return "ratelimit";
    } else if (req.body) {
      return req.body.status;
    } else return "error";
  }

  /**
   * Makes a request to submit a password reset based on information from `SubmitResetForm`
   *
   * @param submitResetForm `SubmitResetForm` object
   *
   * @returns HTTP response of request
   */
  async sendPasswordReset(submitResetForm: SubmitResetForm): Promise<ApiResponseOptions> {
    const req = await lastValueFrom(this.http.get<ApiResponse<User>>("/api/auth/reset/password/send/" + submitResetForm.email, { observe: "response" }));

    if (req.status === 429) {
      return ApiResponseOptions.Ratelimit;
    } else if (req.body) {
      return ApiResponseOptions.Success;
    } else return ApiResponseOptions.Fail;
  }

  /**
   * Makes a request to update the password of a user that is already authenticated
   *
   * @param existingPassword The existing password of the user
   * @param newPassword The new password of the user
   *
   * @returns HTTP status of request
   */
  async setPasswordAuthenticated(existingPassword: string, newPassword: string): Promise<ApiResponseOptions | null> {
    try {
      await lastValueFrom(this.http.post<ApiResponse<User>>(
          "/api/auth/reset/password/set",
          {
            existingPassword,
            newPassword
          }, { observe: "response" }))
      ;

      return ApiResponseOptions.Success;
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        switch (e.status) {
          case 401:
            return ApiResponseOptions.Incorrect;
          case 429:
            return ApiResponseOptions.Ratelimit;
          default:
            return ApiResponseOptions.Error;
        }
      }

      return ApiResponseOptions.Error;
    }
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
      } else if (login.body && login.body.status === ApiResponseOptions.Success) {
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

    let register: HttpResponse<ApiResponse<null>>;

    try {
      register = await lastValueFrom(this.http.post<ApiResponse<null>>("/api/auth/register", body, { observe: "response" }));

      if (
        register.body &&
        register.body.status === ApiResponseOptions.Success
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

  /**
   * Makes a request to send verification email
  */
  async resendVerificationEmail(): Promise<ApiResponseOptions> {
    const response = await lastValueFrom(this.http.post<ApiResponse<null>>("/api/auth/resendVerification", {}));
    return response.status;
  }
}
