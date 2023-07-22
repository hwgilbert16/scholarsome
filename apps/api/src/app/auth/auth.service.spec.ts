import * as bcrypt from "bcrypt";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { HttpService } from "@nestjs/axios";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { createMock } from "@golevelup/ts-jest";
import { RedisService } from "@liaoliaots/nestjs-redis";
import { Request, Response } from "express";
import { of } from "rxjs";

describe("AuthService", () => {
  let authService: AuthService;
  let redisService: RedisService;

  let userData = {
    id: 1,
    username: "John",
    email: "john@smith.com",
    password: bcrypt.hashSync("password", 10),
    verified: true
  };

  let recaptchaBody = {
    data: {
      score: 0.5
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as { [key: string]: any }
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            user: jest.fn().mockResolvedValue(userData)
          }
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>()
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn().mockReturnValue(of(recaptchaBody))
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        },
        {
          provide: RedisService,
          useValue: createMock<RedisService>()
        }
      ]
    }).compile();

    authService = await module.get(AuthService);
    redisService = await module.get(RedisService);
  });

  afterEach(() => {
    userData = {
      id: 1,
      username: "John",
      email: "john@smith.com",
      password: bcrypt.hashSync("password", 10),
      verified: true
    };

    recaptchaBody = {
      data: {
        score: 0.5
      }
    };
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe("when the validateRecaptcha method is called", () => {
    it("should return true for a score >= 5", async () => {
      const result = await authService.validateRecaptcha("");
      expect(result).toBe(true);
    });

    it("should return false for a score < 5", async () => {
      recaptchaBody.data.score = 0;

      const result = await authService.validateRecaptcha("");
      expect(result).toBe(false);
    });

    it("should return false for a body containing an error", async () => {
      recaptchaBody.data["error-codes"] = [];

      const result = await authService.validateRecaptcha("");
      expect(result).toBe(false);
    });
  });

  describe("when the validateUser method is called", () => {
    it("should verify a correct hashed password", async () => {
      const result = await authService.validateUser("", "password");
      expect(result).toBe(true);
    });

    it("should not verify an incorrect hashed password", async () => {
      const result = await authService.validateUser("", "_password");
      expect(result).toBe(false);
    });
  });

  describe("when the logout method is called", () => {
    it("should reset the cookies", async () => {
      const req = {
        cookies: {
          // eslint-disable-next-line camelcase
          access_token: ""
        }
      } as Request;

      const res = {
        cookie: jest.fn()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as Response;

      await authService.logout(req, res);

      expect(res.cookie).toHaveBeenNthCalledWith(1, "access_token", "", {
        httpOnly: true,
        expires: expect.any(Date)
      });
      expect(res.cookie).toHaveBeenNthCalledWith(2, "refresh_token", "", {
        httpOnly: true,
        expires: expect.any(Date)
      });
      expect(res.cookie).toHaveBeenNthCalledWith(3, "authenticated", "", {
        httpOnly: false,
        expires: expect.any(Date)
      });
    });

    it("should delete key from redis when email exists", async () => {
      const req = {
        cookies: {
          // this decodes to having a property with a value of a@a.com
          // eslint-disable-next-line camelcase
          access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhQGEuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.mmqUsu7kpT7M9QUYj69X1TNVCyatAPgky9JXtrSuHrU"
        }
      } as Request;

      const res = {
        cookie: jest.fn()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as Response;

      await authService.logout(req, res);

      expect(redisService.getClient().del).toHaveBeenCalledWith("a@a.com");
    });
  });
});
