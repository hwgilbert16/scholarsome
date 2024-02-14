import { Injectable } from "@nestjs/common";
import { StorageProvider } from "./interfaces/storage-provider.interface";
import { ConfigService } from "@nestjs/config";
import { StorageConfig } from "./storage.config";
import { StorageType } from "./interfaces/storage-type.enum";
import { S3StorageProvider } from "./provider/s3.storage";
import { LocalStorageProvider } from "./provider/local.storage";

@Injectable()
export class StorageService {
  private readonly storageProvider: StorageProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly storageConfig: StorageConfig
  ) {
    const storageOptions = storageConfig.createStorageOptions();

    this.storageProvider =
      storageOptions.storageType === StorageType.S3 ?
        new S3StorageProvider(configService) :
        new LocalStorageProvider(configService);
  }

  /**
   *
   * Get the StorageProvider instance.
   *
   * @returns StorageProvider instance.
   */
  public getInstance(): StorageProvider {
    return this.storageProvider;
  }
}
