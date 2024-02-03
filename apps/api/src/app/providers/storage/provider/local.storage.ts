import * as path from 'node:path';
import * as fs from 'node:fs';
import { StorageProvider } from '../interfaces/storage-provider.interface';
import { ConfigService } from '@nestjs/config';

export class LocalStorageProvider implements StorageProvider {
  private localStorageDir: string;

  constructor(readonly configService: ConfigService) {
    this.localStorageDir = configService.get<string>('STORAGE_LOCAL_DIR');
  }

  public async getFile(key: string): Promise<Uint8Array | null> {
    const filePath = path.join(this.localStorageDir, key);

    if (!fs.existsSync(filePath)) return null;

    return await fs.promises.readFile(filePath);
  }

  public async putFile(key: string, body: Uint8Array) {
    const filePath = path.join(this.localStorageDir, key);
    const fileDir = path.dirname(filePath);

    if (!fs.existsSync(fileDir))
      await fs.promises.mkdir(fileDir, { recursive: true });

    await fs.promises.writeFile(key, body);
  }
}
