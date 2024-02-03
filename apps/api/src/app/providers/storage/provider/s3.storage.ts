import { S3 } from '@aws-sdk/client-s3';
import { StorageProvider } from '../interfaces/storage-provider.interface';
import { ConfigService } from '@nestjs/config';

export class S3StorageProvider implements StorageProvider {
  private s3: S3;
  private bucket: string;

  constructor(readonly configService: ConfigService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: configService.get<string>('S3_STORAGE_ACCESS_KEY'),
        secretAccessKey: configService.get<string>('S3_STORAGE_SECRET_KEY'),
      },
      endpoint: configService.get<string>('S3_STORAGE_ENDPOINT'),
      region: configService.get<string>('S3_STORAGE_REGION'),
    });

    this.bucket = configService.get<string>('S3_STORAGE_BUCKET');
  }

  public async getFile(key: string): Promise<Uint8Array | null> {
    const file = await this.s3.getObject({
      Key: key,
      Bucket: this.bucket,
    });

    const content = await file.Body.transformToByteArray();

    return content;
  }

  public async putFile(key: string, body: Buffer) {
    await this.s3.putObject({ Body: body, Bucket: this.bucket, Key: key });
  }
}
