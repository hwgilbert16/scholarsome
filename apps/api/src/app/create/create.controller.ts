import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { CreateSetDto } from "./dto/createSet.dto";
import { Request } from "@nestjs/common";
import { UsersService } from "../providers/database/users/users.service";
import { SetsService } from "../providers/database/sets/sets.service";

@UseGuards(AuthenticatedGuard)
@Controller('create')
export class CreateController {
  constructor(private usersService: UsersService, private setsService: SetsService) {}

  @Post('set')
  async createSet(@Body() body: CreateSetDto, @Request() req) {
    const email = this.usersService.getUserEmail(req);

    const author = await this.usersService.user({
      email,
    });

    if (!author) {
      throw new HttpException('Conflict', HttpStatus.BAD_REQUEST);
    }

    const set = await this.setsService.createSet({
      author: {
        connect: {
          email: author.email
        }
      },
      title: body.title,
      description: body.description,
      private: body.private,
      cards: {
        createMany: {
          data: body.cards.map(c => {
            return {
              index: c.index,
              term: c.term,
              definition: c.definition
            }
          })
        }
      },
    })

    return {
      id: set.id
    }
  }
}
