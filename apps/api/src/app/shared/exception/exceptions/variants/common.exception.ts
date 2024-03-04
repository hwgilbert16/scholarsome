import { HttpStatus } from "@nestjs/common";
import { ExceptionVariant } from "../../annotations/exception-variant.decorator";
import {
  CustomizableVariant,
  Variant
} from "../../interfaces/variant.interface";

export class CommonException {
  @ExceptionVariant(
      "An internal error occurred.",
      "An internal exception occurred with the server.",
      HttpStatus.INTERNAL_SERVER_ERROR
  )
  public static readonly InternalServerError: CustomizableVariant;

  @ExceptionVariant(
      "Too many requests.",
      "Please, try again in a few seconds.",
      HttpStatus.TOO_MANY_REQUESTS
  )
  public static readonly TooManyRequests: Variant;
}
