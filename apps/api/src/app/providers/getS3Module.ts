import { ConfigService } from "@nestjs/config";
import { S3Module } from "nestjs-s3";

export function getS3Module() {
  return S3Module.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      config: {
        credentials: {
          accessKeyId: configService.get<string>("S3_STORAGE_ACCESS_KEY"),
          secretAccessKey: configService.get<string>("S3_STORAGE_SECRET_KEY")
        },
        region: configService.get<string>("S3_STORAGE_REGION"),
        endpoint: configService.get<string>("S3_STORAGE_ENDPOINT")
      }
    })
  });
}
