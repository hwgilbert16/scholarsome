import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { createMock } from "@golevelup/ts-jest";
import { JwtService } from "@nestjs/jwt";
import { HttpService } from "@nestjs/axios";
import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { RedisService } from "@liaoliaots/nestjs-redis";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { MailService } from "../providers/mail/mail.service";
import { Request, Response } from "express";

describe("AuthController", () => {
  let authController: AuthController;
  let usersService: UsersService;

  const resetTokenReq = {
    cookies: {
      resetToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJyZXNldCI6InRydWUiLCJlbWFpbCI6ImFAYS5jb20ifQ.4xRSOpUWnOUmX24W_cQn3ss4H-qNPB5D84eHLXIg1gQ"
    }
  } as Request;

  const res = {
    status: jest.fn(),
    cookie: jest.fn(),
    redirect: jest.fn()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any as Response;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: createMock<UsersService>()
        },
        {
          provide: AuthService,
          useValue: createMock<AuthService>()
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>()
        },
        {
          provide: MailService,
          useValue: createMock<MailService>()
        },
        {
          provide: HttpService,
          useValue: createMock<HttpService>()
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => {
              return "a";
            }
          }
        },
        {
          provide: RedisService,
          useValue: createMock<RedisService>()
        },
        ThrottlerGuard
      ],
      controllers: [
        AuthController
      ],
      imports: [ThrottlerModule.forRoot()]
    }).compile();

    authController = module.get(AuthController);
    usersService = module.get(UsersService);
  });

  it("should be defined", () => {
    expect(authController).toBeDefined();
  });

  describe("when the GET /reset/password route is called", () => {
    const dto = {
      password: "a"
    };

    it("should throw an error with an invalid resetToken", async () => {
      const req = {
        cookies: {
          resetToken: "a"
        }
      } as Request;

      const result = await authController.resetPassword(dto, res, req);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(result).toEqual({
        status: "fail",
        message: "Invalid reset token"
      });
    });

    it("should successfully reset the user's password", async () => {
      const result = await authController.resetPassword(dto, res, resetTokenReq);

      expect(usersService.updateUser).toHaveBeenCalled();
      expect(result).toEqual({
        status: "success",
        data: {}
      });
    });
  });

  describe("when the GET /reset/password/setCookie/:token route is called", () => {
    it("should redirect to /reset", async () => {
      await authController.setResetCookie({ token: "" }, res);

      expect(res.redirect).toHaveBeenCalled();
    });
  });
});
