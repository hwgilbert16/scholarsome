import * as node_path from "node:path";
import * as fs from "node:fs";
import { StorageProvider } from "../interfaces/storage-provider.interface";
import { ConfigService } from "@nestjs/config";
import { File } from "../interfaces/file.interface";

export class LocalStorageProvider implements StorageProvider {
  private localStorageDir: string;

  constructor(readonly configService: ConfigService) {
    this.localStorageDir = configService.get<string>("STORAGE_LOCAL_DIR");
  }

  public async getFile(path: string): Promise<File> {
    const filePath = node_path.join(this.localStorageDir, path);

    if (!fs.existsSync(filePath)) return null;

    return { path, content: await fs.promises.readFile(filePath) };
  }

  public async putFile(path: string, data: Uint8Array) {
    const filePath = node_path.join(this.localStorageDir, path);
    const fileDir = node_path.dirname(filePath);

    if (!fs.existsSync(fileDir))
      await fs.promises.mkdir(fileDir, { recursive: true });

    await fs.promises.writeFile(path, data);
  }

  public async getDirectoryFiles(path: string): Promise<File[]> {
    if (!(await this.isDirectory(path)))
      throw new Error(`the path provided is not a directory: "${path}"`);

    const filenames = await fs.promises.readdir(path);
    const files: File[] = await Promise.all(
      filenames.map(async (filename) => ({
        path: filename,
        content: await fs.promises.readFile(node_path.join(path, filename)),
      }))
    );

    return files;
  }

  public async deleteFile(path: string): Promise<void> {
    if (!(await this.isFile(path)))
      throw new Error(`the path provided is not a file: "${path}"`);

    await fs.promises.rm(path);
  }

  public async deleteDirectoryFiles(path: string): Promise<void> {
    if (!(await this.isDirectory(path)))
      throw new Error(`the path provided is not a directory: "${path}"`);

    await fs.promises.rm(path, { recursive: true, force: true });
  }

  public async isDirectory(path: string): Promise<boolean> {
    return (await fs.promises.stat(path)).isDirectory();
  }

  public async isFile(path: string): Promise<boolean> {
    return (await fs.promises.stat(path)).isDirectory();
  }
}