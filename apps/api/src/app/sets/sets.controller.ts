import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { SetsService } from "../providers/database/sets/sets.service";
import { CreateSetDto } from "./dto/createSet.dto";
import { UsersService } from "../providers/database/users/users.service";

@UseGuards(AuthenticatedGuard)
@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService, private usersService: UsersService) {}

  @Get(':setId')
  async set({params}: { params: { setId: string } }) {
    return await this.setsService.set({
      id: params.setId
    });
  }

  @Get('/user/:authorId')
  async sets(@Param() params: { authorId: string }, @Request() req) {
    if (params.authorId === 'self') {
      return await this.setsService.sets({
        where: {
          authorId: this.usersService.getUserInfo(req).id
        }
      });
    } else {
      return await this.setsService.sets({
        where: {
          authorId: params.authorId
        }
      });
    }
  }

  @Post()
  async createSet(@Body() body: CreateSetDto, @Request() req) {
    const email = this.usersService.getUserInfo(req).email;

    const author = await this.usersService.user({
      email,
    });

    if (!author) {
      throw new HttpException('Conflict', HttpStatus.BAD_REQUEST);
    }

    return await this.setsService.createSet({
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
    });
  }

  @Put(':setId')
  async updateSet(@Param() params: { setId: string }) {}

  @Delete(':setId')
  async deleteSet(@Param() params: { setId: string }) {
    return await this.setsService.deleteSet({
      id: params.setId
    });
  }
}
