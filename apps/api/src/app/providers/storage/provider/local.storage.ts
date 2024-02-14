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

    await fs.promises.writeFile(filePath, data);
  }

  public async getDirectoryFiles(path: string): Promise<File[]> {
    const dirPath = node_path.join(this.localStorageDir, path);

    if (!(await this.isDirectory(dirPath)))
      throw new Error(`the path provided is not a directory: "${dirPath}"`);

    const filenames = await fs.promises.readdir(dirPath);

    for (const entity of await fs.promises.readdir(dirPath))
      if (await this.isDirectory(node_path.join(dirPath, entity)))
        throw new Error(`directory "${dirPath}" contains subdirectories.`);

    const files: File[] = await Promise.all(
      filenames.map(async (fileName) => ({
        fileName,
        content: await fs.promises.readFile(node_path.join(dirPath, fileName)),
      }))
    );

    return files;
  }

  public async deleteFile(path: string): Promise<void> {
    const filePath = node_path.join(this.localStorageDir, path);

    if (!(await this.isFile(filePath)))
      throw new Error(`the path provided is not a file: "${filePath}"`);

    await fs.promises.rm(filePath);
  }

  public async deleteDirectoryFiles(path: string): Promise<void> {
    const dirPath = node_path.join(this.localStorageDir, path);

    if (!(await this.isDirectory(dirPath)))
      throw new Error(`the path provided is not a directory: "${dirPath}"`);

    for (const entity of await fs.promises.readdir(dirPath))
      if (await this.isDirectory(node_path.join(dirPath, entity)))
        throw new Error(`directory "${dirPath}" contains subdirectories.`);

    await fs.promises.rm(dirPath, { recursive: true, force: true });
  }

  public async isDirectory(path: string): Promise<boolean> {
    return (await fs.promises.stat(path)).isDirectory();
  }

  public async isFile(path: string): Promise<boolean> {
    return (await fs.promises.stat(path)).isFile();
  }
}
