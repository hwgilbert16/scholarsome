import { S3 } from "@aws-sdk/client-s3";
import { StorageProvider } from "../interfaces/storage-provider.interface";
import { ConfigService } from "@nestjs/config";

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

  public async getFile(path: string): Promise<Uint8Array | null> {
    const file = await this.s3.getObject({
      Key: path,
      Bucket: this.bucket,
    });

    const content = await file.Body.transformToByteArray();

    return content;
  }

  public async putFile(path: string, data: Buffer) {
    await this.s3.putObject({ Body: data, Bucket: this.bucket, Key: path });
  }

  public async getDirectoryFiles(path: string): Promise<Uint8Array[]> {
    // TODO: throw an error if path is a file.

    const files = await this.s3.listObjects({
      Prefix: path,
      Delimiter: "/",
      Bucket: this.bucket,
    });

    const contents = await Promise.all(
      files.Contents.map(
        async ({ Key }) => await this.s3.getObject({ Key, Bucket: this.bucket })
      )
    );

    return await Promise.all(
      contents.map(async (file) => await file.Body.transformToByteArray())
    );
  }

  public async deleteFile(path: string): Promise<void> {
    // TODO: throw an error if path is a directory.

    await this.s3.deleteObject({
      Key: path,
      Bucket: this.bucket,
    });
  }

  public async deleteDirectoryFiles(path: string): Promise<void> {
    // TODO: throw an error if path is a file.

    const files = await this.s3.listObjects({
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
}
