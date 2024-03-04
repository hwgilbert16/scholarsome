import { ValidationError } from "@nestjs/common";
import { CommonHttpException } from "./exceptions/common-http.exception";
import { EXCEPTION_TITLE } from "./annotations/metadata_keys";

export class ExceptionFactory {
  public static transform(errors: ValidationError[]) {
    const target = errors[0].target?.constructor;

    const responseErrors = errors.map((e) => ({
      field: e.property,
      errors: Object.values(e.constraints)
    }));

    return new CommonHttpException(
        Reflect.getMetadata(EXCEPTION_TITLE, target) ??
        "A schema validation error occured.",
        responseErrors,
        403
    );
  }
}
