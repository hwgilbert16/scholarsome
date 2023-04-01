export interface RecaptchaRequest {
  secret: string;
  response: string;
  remoteip?: string;
}
