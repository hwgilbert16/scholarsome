import { RegisterForm } from "./registerForm";

export interface RegisterFormCaptcha extends RegisterForm {
  recaptchaToken: string;
}
