import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { SetsService } from "../../sets/sets.service";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateCardDto } from "../dto/createCard.dto";
import { AuthService } from "../../auth/services/auth.service";

@Injectable()
export class CreateCardGuard implements CanActivate {
  constructor(
    private readonly setsService: SetsService,
    private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const body: CreateCardDto = context.switchToHttp().getRequest().body;

    // guards are executed before pipes -> we have to manually validate body
    if ((await validate(plainToClass(CreateCardDto, body))).length > 0)
      throw new BadRequestException();

    const user = await this.authService.getUserInfo(
      context.switchToHttp().getRequest()
    );
    if (!user) throw new NotFoundException();

    const set = await this.setsService.set({ id: body.setId });

    if (!set || set.authorId !== user.id) throw new UnauthorizedException();

    return true;
  }
}
