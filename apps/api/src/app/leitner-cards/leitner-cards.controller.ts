import { Body, Controller, Param, Patch, Request, UnauthorizedException } from "@nestjs/common";
import { CardIdParam } from "./param/cardId.param";
import { Request as ExpressRequest } from "express";
import { UsersService } from "../users/users.service";
import { UpdateLeitnerCardDto } from "./dto/updateLeitnerCard.dto";
import { LeitnerCardsService } from "./leitner-cards.service";
import { LeitnerSetsService } from "../leitner-sets/leitner-sets.service";

@Controller("leitner-sets/cards")
export class LeitnerCardsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly leitnerCardsService: LeitnerCardsService,
    private readonly leitnerSetsService: LeitnerSetsService
  ) {}

  @Patch(":cardId")
  async updateLeitnerCard(@Param() params: CardIdParam, @Body() body: UpdateLeitnerCardDto, @Request() req: ExpressRequest) {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
  }
}
