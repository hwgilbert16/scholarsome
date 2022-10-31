export interface RecaptchaRequest {
  secret: string;
  response: string;
  remoteip?: string;
}

export interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  score?: number;
  action?: string;
  'error-codes': string[];
}
