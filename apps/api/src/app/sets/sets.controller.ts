import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus, NotFoundException,
  Param,
  Post,
  Put,
  Request, UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { SetsService } from "../providers/database/sets/sets.service";
import { CreateSetDto } from "./dto/createSet.dto";
import { UsersService } from "../providers/database/users/users.service";

@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService, private usersService: UsersService) {}

  async verifyOwnership(authorId: string, setId: string): Promise<boolean> {
    const set = await this.setsService.set({
      id: setId
    });

    return !(!set || set.authorId !== authorId);
  }

  @Get(':setId')
  async set(@Param() params: { setId: string }, @Request() req) {
    const set = await this.setsService.set({
      id: params.setId
    });

    if (set.private) {
      const author = this.usersService.getUserInfo(req);

      if (!author) throw new UnauthorizedException();

      if (!(await this.verifyOwnership(author.id, params.setId))) {
        throw new UnauthorizedException();
      }
    }

    return set;
  }

  @Get('/user/:authorId')
  async sets(@Param() params: { authorId: string }, @Request() req) {
    const user = this.usersService.getUserInfo(req);

    if (!user) {
      throw new NotFoundException();
    }

    if (params.authorId === 'self') {
      return await this.setsService.sets({
        where: {
          authorId: user.id
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

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createSet(@Body() body: CreateSetDto, @Request() req) {
    const user = this.usersService.getUserInfo(req);

    if (!user) {
      throw new NotFoundException();
    }

    const author = await this.usersService.user({
      email: user.email,
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

  @UseGuards(AuthenticatedGuard)
  @Put(':setId')
  async updateSet(@Param() params: { setId: string }) {}

  @UseGuards(AuthenticatedGuard)
  @Delete(':setId')
  async deleteSet(@Param() params: { setId: string }) {
    return await this.setsService.deleteSet({
      id: params.setId
    });
  }
}
