import { Body, Controller, NotFoundException, Param, Patch, Request, UnauthorizedException } from "@nestjs/common";
import { CardIdParam } from "./param/cardId.param";
import { Request as ExpressRequest } from "express";
import { UsersService } from "../users/users.service";
import { UpdateLeitnerCardDto } from "./dto/updateLeitnerCard.dto";
import { LeitnerCardsService } from "./leitner-cards.service";
import { LeitnerSetsService } from "../leitner-sets/leitner-sets.service";
import { ApiResponse, ApiResponseOptions } from "@scholarsome/shared";
import { LeitnerCard as PrismaLeitnerCard } from "@prisma/client";

@Controller("leitner-sets/cards")
export class LeitnerCardsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly leitnerCardsService: LeitnerCardsService,
    private readonly leitnerSetsService: LeitnerSetsService
  ) {}

  @Patch(":cardId")
  async updateLeitnerCard(@Param() params: CardIdParam, @Body() body: UpdateLeitnerCardDto, @Request() req: ExpressRequest): Promise<ApiResponse<PrismaLeitnerCard>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const leitnerSet = await this.leitnerSetsService.leitnerSets({
      where: {
        leitnerCards: {
          some: {
            cardId: params.cardId
          }
        },
        userId: user.id
      }
    });

    if (!leitnerSet[0]) throw new NotFoundException({ status: "fail", message: "Leitner Set not found" });
    if (!leitnerSet[0].leitnerCards.filter((lc) => lc.cardId === params.cardId)[0]) throw new NotFoundException({ status: "fail", message: "Leitner Card not found" });

    const leitnerCardId = leitnerSet[0].leitnerCards.filter((lc) => lc.cardId === params.cardId)[0].id;

    // remove card from unlearned array if card is now learned
    if (body.learned) {
      await this.leitnerSetsService.updateLeitnerSet({
        where: {
          setId_userId: {
            setId: leitnerSet[0].setId,
            userId: user.id
          }
        },
        data: {
          studySession: {
            update: {
              unlearnedCards: {
                deleteMany: {
                  leitnerCardId,
                  studySessionUnlearnedId: leitnerSet[0].studySessionId
                }
              }
            }
          }
        }
      });
    }

    return {
      status: ApiResponseOptions.Success,
      data: await this.leitnerCardsService.updateLeitnerCard({
        where: {
          leitnerSetId_cardId: {
            leitnerSetId: leitnerSet[0].id,
            cardId: params.cardId
          }
        },
        data: {
          box: body.box,
          due: body.due,
          leitnerSet: body.learned ? {
            update: {
              studySession: {
                update: {
                  learnedCards: {
                    create: {
                      leitnerCardId
                    }
                  }
                }
              }
            }
          } : undefined
        }
      })
    };
  }
}
