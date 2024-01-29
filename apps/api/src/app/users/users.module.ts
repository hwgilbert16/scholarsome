import { forwardRef, Module } from "@nestjs/common";
import { DatabaseModule } from "../providers/database/database.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
