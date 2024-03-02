import { Module } from "@nestjs/common";
import { StorageConfig } from "./storage.config";
import { StorageService } from "./storage.service";

@Module({
  providers: [StorageConfig, StorageService],
  exports: [StorageService]
})
export class StorageModule {}
