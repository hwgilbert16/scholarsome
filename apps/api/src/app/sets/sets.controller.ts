import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { SetsService } from "../providers/database/sets/sets.service";
import { CreateSetBodyDto } from "./dto/createSetBody.dto";
import { UsersService } from "../providers/database/users/users.service";
import { Request as ExpressRequest } from 'express';
import { UpdateSetBodyDto } from "./dto/updateSetBody.dto";
import { SetIdParam } from "./dto/setIdParam";
import { AuthorIdParam } from "./dto/authorIdParam";

@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService, private usersService: UsersService) {}

  @Get(':setId')
  async set(@Param() params: SetIdParam, @Request() req: ExpressRequest) {
    const userCookie = this.usersService.getUserInfo(req);
    if (!userCookie) {
      throw new NotFoundException();
    }

    const user = await this.usersService.user({
      id: userCookie.id
    });
    if (!user) throw new BadRequestException();

    const set = await this.setsService.set({
      id: params.setId
    });

    if (set.private && (set.authorId !== userCookie.id)) throw new UnauthorizedException();

    if (!set) throw new NotFoundException();

    return set;
  }

  @Get('/user/:authorId')
  async sets(@Param() params: AuthorIdParam, @Request() req: ExpressRequest) {
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
    }

    if (params.authorId === user.id) {
      return await this.setsService.sets({
        where: {
          authorId: params.authorId
        }
      });
    } else {
      let sets = await this.setsService.sets({
        where: {
          authorId: params.authorId
        }
      });

      for (const set of sets) {
        if (set.private) {
          sets = sets.filter(s => s.id !== set.id);
        }
      }

      return sets;
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createSet(@Body() body: CreateSetBodyDto, @Request() req: ExpressRequest) {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new NotFoundException();

    const author = await this.usersService.user({
      email: user.email
    });
    if (!author) throw new NotFoundException();

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
            };
          })
        }
      }
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':setId')
  async updateSet(@Param() params: SetIdParam, @Body() body: UpdateSetBodyDto, @Request() req: ExpressRequest) {
    const set = await this.setsService.set({
      id: params.setId
    });
    if (!set) throw new NotFoundException();

    if (!(await this.setsService.verifySetOwnership(req, params.setId))) throw new UnauthorizedException();

    return await this.setsService.updateSet({
      where: {
        id: set.id
      },
      data: {
        title: body.title,
        description: body.description,
        private: body.private,
        cards: body.cards ? {
          deleteMany: {
            id: {
              in: body.cards.map(c => c.id)
            }
          },
          createMany: {
            data: body.cards.map(c => {
              return {
                index: c.index,
                term: c.term,
                definition: c.definition
              };
            })
          }
        } : null
      }
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':setId')
  async deleteSet(@Param() params: SetIdParam, @Request() req: ExpressRequest) {
    if (!(await this.setsService.verifySetOwnership(req, params.setId))) throw new UnauthorizedException();

    return await this.setsService.deleteSet({
      id: params.setId
    });
  }
}
