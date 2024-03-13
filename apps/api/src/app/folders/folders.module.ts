import { forwardRef, Module } from "@nestjs/common";
import { FoldersService } from "./folders.service";
import { FoldersController } from "./folders.controller";
import { DatabaseModule } from "../providers/database/database.module";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { SetsModule } from "../sets/sets.module";

@Module({
  providers: [FoldersService],
  controllers: [FoldersController],
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    forwardRef(() => SetsModule)
  ],
  exports: [FoldersService]
})
export class FoldersModule {}
