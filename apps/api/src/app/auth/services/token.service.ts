import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../types/token-payload.interface";
import { randomUUID } from "node:crypto";
import { TokenType } from "../types/token-type.enum";

@Injectable()
export class TokenService {
  private accessTokenExpiresIn: number;
  private refreshTokenExpiresIn: number;

  constructor(private jwtService: JwtService, configService: ConfigService) {
    this.accessTokenExpiresIn = Number(
      configService.get<number>("JWT_ACCESS_TOKEN_EXPIRES_IN")
    );
    this.refreshTokenExpiresIn = Number(
      configService.get<number>("JWT_REFRESH_TOKEN_EXPIRES_IN")
    );
  }

  /**
   *
   * @param id User's id
   * @param jti Refresh token id
   * @returns Access token
   */
  public async issueAccessToken(id: string, jti: string): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: id,
      rti: jti,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  /**
   *
   * @param id User's id
   * @param customExpirationTimestamp Optional custom exp claim value
   * @returns Refresh token and its id
   */
  public async issueRefreshToken(
    id: string,
    customExpirationTimestamp?: number
  ): Promise<{ token: string; jti: string; exp: number }> {
    const jti = randomUUID();

    const exp = new Date().getTime() / 1000 + this.refreshTokenExpiresIn;

    const payload: RefreshTokenPayload = {
      sub: id,
      jti,
      exp: customExpirationTimestamp ?? exp - (exp % 1),
    };

    const token = await this.jwtService.signAsync(payload);

    return { token, jti, exp: payload.exp };
  }

  /**
   *
   * @param id User's id
   * @returns Access and refresh tokens, refresh token expiration (unix timestamp)
   */
  public async issueTokenPair(id: string): Promise<{
    accessToken: string;
    refreshToken: string;
    jti: string;
    exp: number;
  }> {
    const { token: refreshToken, jti, exp } = await this.issueRefreshToken(id);
    const accessToken = await this.issueAccessToken(id, jti);

    return { accessToken, refreshToken, jti, exp };
  }

  public async refreshTokens(payload: RefreshTokenPayload): Promise<{
    accessToken: string;
    refreshToken: string;
    jti: string;
    exp: number;
  }> {
    const {
      token: refreshToken,
      jti,
      exp,
    } = await this.issueRefreshToken(payload.sub, payload.exp);
    const accessToken = await this.issueAccessToken(payload.sub, jti);

    return { accessToken, refreshToken, jti, exp };
  }

  /**
   * Decodes the token and verifies the structure
   *
   * @param token
   * @param requiredClaims Claims that must be present in the token
   * @param ignoreExpiration If the token expiration should be ignored
   * @returns Decoded and verified token or null
   */
  private async decodeToken<T>(
    token: string,
    requiredClaims: string[],
    ignoreExpiration?: boolean
  ): Promise<T | null> {
    const payload = await this.jwtService.verifyAsync(token, {
      ignoreExpiration: ignoreExpiration ?? false,
    });

    if (!requiredClaims.every((claim) => typeof payload[claim] === "string"))
      return null;

    return payload;
  }

  public async decodeAccessToken(
    token: string,
    ignoreExpiration?: boolean
  ): Promise<AccessTokenPayload | null> {
    return await this.decodeToken(token, ["sub", "rti"], ignoreExpiration);
  }

  public async decodeRefreshToken(
    token: string,
    ignoreExpiration?: boolean
  ): Promise<RefreshTokenPayload | null> {
    return await this.decodeToken(token, ["sub", "jti"], ignoreExpiration);
  }
}
