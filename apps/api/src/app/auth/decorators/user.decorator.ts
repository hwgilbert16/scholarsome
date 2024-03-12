import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { TokenUser } from "../types/token-user.interface";

export const User = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return request.user as TokenUser;
  }
);
