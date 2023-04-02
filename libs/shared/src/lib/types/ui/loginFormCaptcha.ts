import { LoginForm } from "./loginForm";

export interface LoginFormCaptcha extends LoginForm {
  recaptchaToken: string;
}
