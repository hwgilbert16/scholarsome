import { Injectable } from '@nestjs/common';
import { StorageProvider } from './interfaces/storage-provider.interface';

@Injectable()
export class StorageService {
  private storageProvider: StorageProvider;

  /**
   * @ignore
   */
  constructor() {}
}
