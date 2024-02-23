import { EXCEPTION_TITLE } from "./metadata_keys";

export function ValidationError(title: string) {
  return function <C extends { new (...args: any[]): {} }>(target: C) {
    Reflect.defineMetadata(EXCEPTION_TITLE, title, target);

    return target;
  };
}
