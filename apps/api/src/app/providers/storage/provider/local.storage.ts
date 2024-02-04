import * as node_path from "node:path";
import * as fs from "node:fs";
import { StorageProvider } from "../interfaces/storage-provider.interface";
import { ConfigService } from "@nestjs/config";

export class LocalStorageProvider implements StorageProvider {
  private localStorageDir: string;

  constructor(readonly configService: ConfigService) {
    this.localStorageDir = configService.get<string>("STORAGE_LOCAL_DIR");
  }

  public async getFile(path: string): Promise<Uint8Array | null> {
    const filePath = node_path.join(this.localStorageDir, path);

    if (!fs.existsSync(filePath)) return null;

    return await fs.promises.readFile(filePath);
  }

  public async putFile(path: string, data: Uint8Array) {
    const filePath = node_path.join(this.localStorageDir, path);
    const fileDir = node_path.dirname(filePath);

    if (!fs.existsSync(fileDir))
      await fs.promises.mkdir(fileDir, { recursive: true });

    await fs.promises.writeFile(path, data);
  }
}
