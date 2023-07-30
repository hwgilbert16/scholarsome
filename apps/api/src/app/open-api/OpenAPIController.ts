import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import * as fs from "fs";
import path = require("path");

@Controller("openapi")
export class OpenApiController {
  @Get()
  getOpenApi(@Res() res: Response): void {
    const openApiSpec = fs.readFileSync(path.join(__dirname, "assets", "api-spec.json"));
    res.setHeader("Content-Type", "application/json");
    res.send(openApiSpec);
  }
}
