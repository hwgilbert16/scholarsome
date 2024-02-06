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

    return { fileName: path, content: await fs.promises.readFile(filePath) };
  }

  public async putFile(path: string, data: Uint8Array): Promise<void> {
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

    // node will throw an error if readFile() is called on a directory
    const files: File[] = await Promise.all(
      filenames.map(async (fileName) => ({
        fileName,
        content: await fs.promises.readFile(node_path.join(path, fileName)),
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

    for (const entity of await fs.promises.readdir(path))
      if (await this.isDirectory(entity))
        throw new Error(`directory "${path}" contains subdirectories.`);

    await fs.promises.rm(path, { recursive: false, force: false });
  }

  public async isDirectory(path: string): Promise<boolean> {
    return (await fs.promises.stat(path)).isDirectory();
  }

  public async isFile(path: string): Promise<boolean> {
    return (await fs.promises.stat(path)).isFile();
  }
}
