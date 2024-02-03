import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type StorageType } from './interfaces/storage-type.enum';
import { type StorageOptions } from './interfaces/options.interface';

@Injectable()
export class StorageConfig {
  /**
   * @ignore
   */
  constructor(private configService: ConfigService) {}

  private checkStorageType(storageType: string): storageType is StorageType {
    return ['local', 's3'].includes(storageType);
  }

  private getStorageType(): StorageType {
    const storageType = this.configService.get<string>('STORAGE_TYPE');

    if (!this.checkStorageType(storageType))
      throw new Error(`unsupported STORAGE_TYPE provided: "${storageType}"`);

    return storageType;
  }

  public createStorageOptions(): StorageOptions {
    return {
      storageType: this.getStorageType(),
    };
  }
}
