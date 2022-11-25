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
  Request,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { SetsService } from "../providers/database/sets/sets.service";
import { CreateSetBodyDto } from "./dto/createSetBody.dto";
import { UsersService } from "../providers/database/users/users.service";
import { SelfGuard } from "../auth/self.guard";
import { Request as ExpressRequest } from 'express';
import { UpdateSetBodyDto } from "./dto/updateSetBody.dto";
import { SetIdParam } from "./dto/setIdParam";
import { AuthorIdParam } from "./dto/authorIdParam";
import jwt_decode from "jwt-decode";

@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService, private usersService: UsersService) {}

  async verifyOwnership(req: ExpressRequest, setId: string): Promise<boolean> {
    let accessToken: { id: string; email: string; };

    if (req.cookies['access_token']) {
      accessToken = jwt_decode(req.cookies['access_token']) as { id: string; email: string; };
    } else {
      return false;
    }

    const user = await this.usersService.user({
      id: accessToken.id
    });
    if (!user) return false;

    const set = await this.setsService.set({
      id: setId
    });
    if (!set) return false;

    return set.author.id === user.id;
  }

  @UseGuards(SelfGuard)
  @Get(':setId')
  async set(@Param() params: SetIdParam, @Request() req: ExpressRequest) {
    const set = await this.setsService.set({
      id: params.setId
    });
    if (!set) throw new NotFoundException();

    if (!set.private && !(await this.verifyOwnership(req, params.setId))) throw new UnauthorizedException();

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
    } else if (params.authorId === user.id) {
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
  async createSet(@Body() body: CreateSetBodyDto, @Request() req) {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new NotFoundException();

    const author = await this.usersService.user({
      email: user.email
    });
    if (!author) throw new HttpException('Conflict', HttpStatus.BAD_REQUEST);

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

    if (!(await this.verifyOwnership(req, params.setId))) throw new UnauthorizedException();

    await this.setsService.updateSet({
      where: {
        id: set.id
      },
      data: {
        title: body.title,
        description: body.description,
        private: body.private
      }
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':setId')
  async deleteSet(@Param() params: SetIdParam, @Request() req: ExpressRequest) {
    if (!(await this.verifyOwnership(req, params.setId))) throw new UnauthorizedException();

    return await this.setsService.deleteSet({
      id: params.setId
    });
  }
}
