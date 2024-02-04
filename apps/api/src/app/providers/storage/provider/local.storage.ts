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

  public async getDirectoryFiles(path: string): Promise<Uint8Array[]> {
    if (!(await this.isDir(path)))
      throw new Error(`the path provided is not a directory: "${path}"`);

    const filenames = await fs.promises.readdir(path);
    const files = await Promise.all(
      filenames.map(
        async (filename) =>
          await fs.promises.readFile(node_path.join(path, filename))
      )
    );

    return files;
  }

  public async deleteFile(path: string): Promise<void> {
    if (!(await this.isFile(path)))
      throw new Error(`the path provided is not a file: "${path}"`);

    await fs.promises.rm(path);
  }

  public async deleteDirectoryFiles(path: string): Promise<void> {
    if (!(await this.isDir(path)))
      throw new Error(`the path provided is not a directory: "${path}"`);

    await fs.promises.rm(path, { recursive: true, force: true });
  }

  /**
   * Checks whether given path is a directory.
   *
   * @param path Path to a file or directory.
   *
   * @returns Is path a directory.
   */
  private async isDir(path: string): Promise<boolean> {
    return (await fs.promises.stat(path)).isDirectory();
  }

  /**
   * Checks whether given path is a file.
   *
   * @param path Path to a file or directory.
   *
   * @returns Is path a file.
   */
  private async isFile(path: string): Promise<boolean> {
    return (await fs.promises.stat(path)).isDirectory();
  }
}
