import { HttpException } from "@nestjs/common";

export class CommonHttpException extends HttpException {
  constructor(title: string, detail: string | object, status: number) {
    super({ title, detail }, status);
  }

  public getInfo(): object {
    return this.getResponse() as object;
  }
}
