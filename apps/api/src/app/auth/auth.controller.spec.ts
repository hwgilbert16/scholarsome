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
  let mailService: MailService;

  const resetToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJyZXNldCI6InRydWUiLCJlbWFpbCI6ImFAYS5jb20ifQ.4xRSOpUWnOUmX24W_cQn3ss4H-qNPB5D84eHLXIg1gQ";

  const resetTokenReq = {
    cookies: {
      resetToken
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
          useValue: {
            user: (obj: { email: string }) => {
              return obj.email === "a";
            },
            createUser: jest.fn(),
            updateUser: jest.fn().mockResolvedValue({})
          }
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
          useValue: {
            sendPasswordReset: jest.fn()
          }
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
    mailService = module.get(MailService);

    jest.spyOn(usersService, "user");
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

      expect(usersService.updateUser).toHaveBeenCalledWith({
        where: {
          email: "a@a.com"
        },
        data: {
          password: expect.any(String)
        }
      });
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

    it("should not set a cookie if the param is not valid", async () => {
      await authController.setResetCookie({ token: "" }, res);

      expect(res.cookie).not.toHaveBeenCalled();
    });

    it("should set a cookie if the param is valid", async () => {
      await authController.setResetCookie({ token: resetToken }, res);

      expect(res.cookie).toHaveBeenCalledWith("resetToken", resetToken, {
        httpOnly: false,
        expires: expect.any(Date)
      });
    });
  });

  describe("when the GET /reset/password/:email route is called", () => {
    it("should send an email if user is valid", async () => {
      await authController.sendReset({ email: "a" });

      expect(mailService.sendPasswordReset).toHaveBeenCalledWith("a");
    });

    it("should not send an email if user is not valid", async () => {
      await authController.sendReset({ email: "b" });

      expect(mailService.sendPasswordReset).not.toHaveBeenCalled();
    });

    it("should return the correct value", async () => {
      const result = await authController.sendReset({ email: "a" });

      expect(result).toEqual({
        status: "success",
        data: null
      });
    });
  });

  describe("when the GET /verify/email/:token route is called", () => {
    it("should update the user if the jwt is verified", async () => {
      await authController.verifyEmail({ token: resetToken }, res);

      expect(usersService.updateUser).toHaveBeenCalledWith({
        where: {
          email: "a@a.com"
        },
        data: {
          verified: true
        }
      });
    });

    it("should set the correct cookie if the jwt is verified", async () => {
      await authController.verifyEmail({ token: resetToken }, res);

      expect(res.cookie).toHaveBeenCalledWith("verified", true, {
        expires: expect.any(Date)
      });
    });

    it("should return false if the email is invalid", async () => {
      const result = await authController.verifyEmail({ token: "" }, res);

      expect(result).toEqual({
        status: "fail",
        message: "Invalid token"
      });
    });
  });
});
