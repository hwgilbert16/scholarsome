export interface AccessTokenPayload {
  sub: string;
  rti: string;
  exp?: string;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  exp: number;
}
