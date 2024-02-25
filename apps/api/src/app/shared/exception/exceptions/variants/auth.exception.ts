import { HttpStatus } from "@nestjs/common";
import { ExceptionVariant } from "../../annotations/exception-variant.decorator";
import type { Variant } from "../../interfaces/variant.interface";

export class AuthException {
  // Users

  @ExceptionVariant(
    "User already exists.",
    "User with this email already exists.",
    HttpStatus.BAD_REQUEST
  )
  public static readonly EmailAlreadyExists: Variant;

  @ExceptionVariant(
    "User already exists.",
    "User with this username already exists.",
    HttpStatus.BAD_REQUEST
  )
  public static readonly UsernameAlreadyExists: Variant;

  @ExceptionVariant(
    "Invalid credentials.",
    "Wrong email or password.",
    HttpStatus.UNAUTHORIZED
  )
  public static readonly InvalidCredentials: Variant;

  @ExceptionVariant(
    "Invalid email provided.",
    "User with this email does not exist.",
    HttpStatus.BAD_REQUEST
  )
  public static readonly UserDoesNotExist: Variant;

  // Tokens

  @ExceptionVariant(
    "Token is not provided.",
    "Log in to access the requested resource.",
    HttpStatus.UNAUTHORIZED
  )
  public static readonly TokenNotProvided: Variant;

  @ExceptionVariant(
    "Invalid token provided.",
    "Invalid authentication token provided to access the requested resource.",
    HttpStatus.UNAUTHORIZED
  )
  public static readonly InvalidTokenProvided: Variant;

  @ExceptionVariant(
    "Invalid reset token provided.",
    "Please, provide a valid token to reset the password.",
    HttpStatus.BAD_REQUEST
  )
  public static readonly InvalidResetTokenProvided: Variant;

  @ExceptionVariant(
    "Invalid email verification token provided.",
    "Please, provide a valid token to verify email.",
    HttpStatus.BAD_REQUEST
  )
  public static readonly InvalidEmailVerificationTokenProvided: Variant;

  // API keys

  @ExceptionVariant(
    "API key was not found.",
    "Please, provide a valid existing key.",
    HttpStatus.BAD_REQUEST
  )
  public static readonly ApiKeyNotFound: Variant;
}
