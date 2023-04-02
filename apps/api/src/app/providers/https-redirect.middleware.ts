import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.secure) {
      const httpsUrl = `https://${req.hostname}${req.originalUrl}`;
      res.redirect(HttpStatus.PERMANENT_REDIRECT, httpsUrl);
    } else {
      next();
    }
  }
}
