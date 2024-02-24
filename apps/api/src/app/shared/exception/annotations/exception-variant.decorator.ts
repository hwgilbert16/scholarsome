import { CommonHttpException } from "../exceptions/common-http.exception";

export function ExceptionVariant(
  title: string,
  detail: string,
  status: number
) {
  return function <C extends { new (...args: any[]): {} }>(
    target: C,
    propertyKey: string
  ) {
    class Exception extends CommonHttpException {
      constructor() {
        super(title, detail, status);
      }
    }

    target[propertyKey] = Exception;
  };
}
