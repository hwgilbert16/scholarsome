import { S3 } from "@aws-sdk/client-s3";
import { StorageProvider } from "../interfaces/storage-provider.interface";
import { ConfigService } from "@nestjs/config";
import { File } from "../interfaces/file.interface";

export class S3StorageProvider implements StorageProvider {
  private s3: S3;
  private bucket: string;

  constructor(readonly configService: ConfigService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: configService.get<string>("S3_STORAGE_ACCESS_KEY"),
        secretAccessKey: configService.get<string>("S3_STORAGE_SECRET_KEY"),
      },
      endpoint: configService.get<string>("S3_STORAGE_ENDPOINT"),
      region: configService.get<string>("S3_STORAGE_REGION"),
    });

    this.bucket = configService.get<string>("S3_STORAGE_BUCKET");
  }

  public async getFile(path: string): Promise<File> {
    const file = await this.s3.getObject({
      Key: path,
      Bucket: this.bucket,
    });

    const content = await file.Body.transformToByteArray();

    return { path, content };
  }

  public async putFile(path: string, data: Buffer) {
    await this.s3.putObject({ Body: data, Bucket: this.bucket, Key: path });
  }

  public async getDirectoryFiles(path: string): Promise<File[]> {
    if (!(await this.isDirectory(path)))
      throw new Error(`the path provided is not a directory: "${path}"`);

    const files = await this.s3.listObjects({
      Prefix: path,
      Delimiter: "/",
      Bucket: this.bucket,
    });

    const contents: File[] = await Promise.all(
      files.Contents.map(async ({ Key }) => {
        const file = await this.s3.getObject({ Key, Bucket: this.bucket });

        return { path: Key, content: await file.Body.transformToByteArray() };
      })
    );

    return contents;
  }

  public async deleteFile(path: string): Promise<void> {
    if (!(await this.isFile(path)))
      throw new Error(`the path provided is not a file: "${path}"`);

    await this.s3.deleteObject({
      Key: path,
      Bucket: this.bucket,
    });
  }

  public async deleteDirectoryFiles(path: string): Promise<void> {
    if (!(await this.isDirectory(path)))
      throw new Error(`the path provided is not a directory: "${path}"`);

    const files = await this.s3.listObjectsV2({
      Prefix: path,
      Bucket: this.bucket,
    });

    await Promise.all(
      files.Contents.map(
        async ({ Key }) =>
          await this.s3.deleteObject({ Key, Bucket: this.bucket })
      )
    );
  }

  public async isDirectory(path: string): Promise<boolean> {
    const object = await this.s3.listObjectsV2({
      Prefix: path,
      Bucket: this.bucket,
    });

    return !!object.Contents.length;
  }

  public async isFile(path: string): Promise<boolean> {
    const object = await this.s3.listObjectsV2({
      Prefix: path,
      Bucket: this.bucket,
    });

    return !object.Contents.length;
  }
}
