export interface LoginForm {
  username: string;
  password: string;
  enableCookies: boolean;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
