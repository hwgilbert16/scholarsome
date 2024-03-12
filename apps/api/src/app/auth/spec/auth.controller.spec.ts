import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailService } from '../../providers/mail/mail.service';
import { Request, Response } from 'express';
import { HttpException } from '@nestjs/common';
import { ApiResponseOptions } from '@scholarsome/shared';
import { PrismaService } from '../../providers/database/prisma/prisma.service';

describe('AuthController', () => {
  let authController: AuthController;
  let usersService: UsersService;
  let mailService: MailService;
  let authService: AuthService;

  /*
  The JWT secret for this is "a"

  {
  "sub": "1234567890",
  "iat": 1516239022,
  "forPasswordReset": "true",
  "email": "a@a.com"
  }
   */
  const resetPasswordToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJmb3JQYXNzd29yZFJlc2V0IjoidHJ1ZSIsImVtYWlsIjoiYUBhLmNvbSJ9.ngZpWCACqusCexG6yUFpbsbkwnviNSbDHd5b6sILuX4';

  const resetTokenReq = {
    cookies: {
      resetPasswordToken,
    },
  } as Request;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            user: (obj: { email?: string; username?: string }) => {
              switch (obj.email) {
                case 'true':
                  return true;
                case 'false':
                  return false;
              }

              switch (obj.username) {
                case 'true':
                  return true;
                case 'false':
                  return false;
              }

              return {};
            },
            createUser: jest.fn(),
            updateUser: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: (email: string, password: string) => {
              switch (password) {
                case 'true':
                  return true;
                case 'false':
                  return false;
              }

              switch (email) {
                case 'true':
                  return true;
                case 'false':
                  return false;
              }

              return {};
            },
            setLoginCookies: jest.fn(),
            validateRecaptcha: (s: string) => {
              switch (s) {
                case 'true':
                  return true;
                case 'false':
                  return false;
                default:
                  return {};
              }
            },
            logout: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
        {
          provide: MailService,
          useValue: {
            sendPasswordReset: jest.fn(),
            sendEmailConfirmation: (s: string) => {
              switch (s) {
                case 'true':
                  return true;
                case 'false':
                  return false;
                default:
                  return {};
              }
            },
          },
        },
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => {
              return 'a';
            },
          },
        },
        {
          provide: RedisService,
          useValue: createMock<RedisService>(),
        },
        {
          provide: PrismaService,
          useValue: createMock<PrismaService>(),
        },
      ],
      controllers: [AuthController],
      imports: [ThrottlerModule.forRoot()],
    }).compile();

    authController = module.get(AuthController);
    usersService = module.get(UsersService);
    mailService = module.get(MailService);
    authService = module.get(AuthService);

    jest.spyOn(usersService, 'user');
    jest.spyOn(mailService, 'sendEmailConfirmation');
    jest.spyOn(authService, 'validateUser');
    jest.spyOn(authService, 'validateRecaptcha');
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('when the POST /reset/password route is called', () => {
    const dto = {
      newPassword: 'a',
    };

    const res = {
      status: jest.fn(),
      cookie: jest.fn(),
      redirect: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any as Response;

    it('should throw an error with an invalid resetToken', async () => {
      const req = {
        cookies: {
          resetToken: 'a',
        },
      } as Request;

      await expect(async () => {
        await authController.setPassword(dto, res, req);
      }).rejects.toThrow(HttpException);
    });

    it("should successfully reset the user's password", async () => {
      const result = await authController.setPassword(dto, res, resetTokenReq);

      expect(usersService.updateUser).toHaveBeenCalledWith({
        where: {
          email: 'a@a.com',
        },
        data: {
          password: expect.any(String),
        },
      });
      expect(result).toEqual({
        status: ApiResponseOptions.Success,
        data: {},
      });
    });
  });

  describe('when the GET /reset/password/setCookie/:token route is called', () => {
    const res = {
      status: jest.fn(),
      cookie: jest.fn(),
      redirect: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any as Response;

    it('should redirect to /reset', async () => {
      await authController.verifyPasswordResetRequest({ token: '' }, res);

      expect(res.redirect).toHaveBeenCalled();
    });

    it('should not set a cookie if the param is not valid', async () => {
      await authController.verifyPasswordResetRequest({ token: '' }, res);

      expect(res.cookie).not.toHaveBeenCalled();
    });

    it('should set a cookie if the param is valid', async () => {
      await authController.verifyPasswordResetRequest(
        { token: resetPasswordToken },
        res
      );

      expect(res.cookie).toHaveBeenCalledWith(
        'resetPasswordToken',
        resetPasswordToken,
        {
          httpOnly: false,
          expires: expect.any(Date),
        }
      );
    });
  });

  describe('when the GET /reset/password/:email route is called', () => {
    it('should send an email if user is valid', async () => {
      await authController.sendPasswordReset({ email: 'true' });

      expect(mailService.sendPasswordReset).toHaveBeenCalledWith('true');
    });

    it('should not send an email if user is not valid', async () => {
      await authController.sendPasswordReset({ email: 'false' });

      expect(mailService.sendPasswordReset).not.toHaveBeenCalled();
    });

    it('should return the correct value', async () => {
      const result = await authController.sendPasswordReset({ email: 'true' });

      expect(result).toEqual({
        status: ApiResponseOptions.Success,
        data: null,
      });
    });
  });

  describe('when the GET /verify/email/:token route is called', () => {
    const res = {
      status: jest.fn(),
      cookie: jest.fn(),
      redirect: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any as Response;

    it('should update the user if the jwt is verified', async () => {
      await authController.verifyEmail({ token: resetPasswordToken }, res);

      expect(usersService.updateUser).toHaveBeenCalledWith({
        where: {
          email: 'a@a.com',
        },
        data: {
          verified: true,
        },
      });
    });

    it('should set the correct cookie if the jwt is verified', async () => {
      await authController.verifyEmail({ token: resetPasswordToken }, res);

      expect(res.cookie).toHaveBeenCalledWith('verified', true, {
        expires: expect.any(Date),
      });
    });

    it('should return false if the email is invalid', async () => {
      const result = await authController.verifyEmail({ token: '' }, res);

      expect(result).toEqual({
        status: ApiResponseOptions.Fail,
        message: 'Invalid token',
      });
    });
  });

  describe('when the register route is called', () => {
    const res = {
      status: jest.fn(),
      cookie: jest.fn(),
      redirect: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any as Response;

    it('should return a normal response body', async () => {
      const dto = {
        username: 'false',
        email: 'false',
        password: 'b',
        confirmPassword: 'b',
        recaptchaToken: 'a',
      };

      const result = await authController.register(dto, res);

      expect(result).toEqual({
        status: ApiResponseOptions.Success,
        data: null,
      });
    });

    it('should send HTTP 409 if user already exists', async () => {
      const dto = {
        username: 'true',
        email: 'true',
        password: 'b',
        confirmPassword: 'b',
        recaptchaToken: 'a',
      };

      const result = await authController.register(dto, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(result).toEqual({
        status: ApiResponseOptions.Fail,
        message: 'Email already exists',
      });
    });

    it('should create user if user does not exist', async () => {
      const dto = {
        username: 'false',
        email: 'false',
        password: 'b',
        confirmPassword: 'b',
        recaptchaToken: 'a',
      };

      await authController.register(dto, res);

      expect(usersService.createUser).toHaveBeenCalledWith({
        username: 'false',
        email: 'false',
        password: expect.any(String),
        verified: expect.any(Boolean),
      });
    });

    it('should set login cookies', async () => {
      const dto = {
        username: 'false',
        email: 'false',
        password: 'b',
        confirmPassword: 'b',
        recaptchaToken: 'a',
      };

      await authController.register(dto, res);

      expect(authService.setLoginCookies).toHaveBeenCalled();
    });
  });

  describe('when the login route is called', () => {
    const res = {
      status: jest.fn(),
      cookie: jest.fn(),
      redirect: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any as Response;

    it('should send HTTP 401 if incorrect password', async () => {
      const dto = {
        email: 'false',
        password: 'false',
        recaptchaToken: 'a',
      };

      const result = await authController.login(dto, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(result).toEqual({
        status: ApiResponseOptions.Fail,
        message: 'Incorrect email or password',
      });
    });

    it('should validate recaptcha', async () => {
      const dto = {
        email: 'true',
        password: 'true',
        recaptchaToken: 'true',
      };

      await authController.login(dto, res);

      expect(authService.validateRecaptcha).toHaveBeenCalledWith(
        dto.recaptchaToken
      );
    });

    it('should throw an exception if recaptcha is invalid', async () => {
      const dto = {
        email: 'true',
        password: 'true',
        recaptchaToken: 'false',
      };

      await expect(async () => {
        await authController.login(dto, res);
      }).rejects.toThrow(HttpException);
    });

    it('should send HTTP 500 if unable to find user', async () => {
      const dto = {
        email: 'false',
        password: 'true',
        recaptchaToken: 'true',
      };

      const result = await authController.login(dto, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(result).toEqual({
        status: 'error',
        message: 'Error finding user',
      });
    });

    it('should set cookies if logging in user', async () => {
      const dto = {
        email: 'true',
        password: 'true',
        recaptchaToken: 'true',
      };

      await authController.login(dto, res);

      expect(authService.setLoginCookies).toHaveBeenCalled();
    });
  });

  describe('when POST /logout method is called', () => {
    const res = {
      status: jest.fn(),
      cookie: jest.fn(),
      redirect: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any as Response;

    it('should call the logout method', async () => {
      const req = {} as any as Request;

      await authController.logout(req, res);

      expect(authService.logout).toHaveBeenCalled();
    });
  });
});
