export interface LoginForm {
  username: string;
  password: string;
}

export interface SubmitResetForm {
  email: string;
}

export interface ResetForm {
  password: string;
}

export interface LoginFormCaptcha extends LoginForm {
  recaptchaToken: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormCaptcha extends RegisterForm {
  recaptchaToken: string;
}
