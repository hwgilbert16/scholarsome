import { EXAMPLE_CONTENT, STORAGE_LOCAL, STORAGE_LOCAL_DIR } from "./constants";
import { StorageService } from "../storage.service";
import { StorageConfig } from "../storage.config";
import { Test } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { LocalStorageProvider } from "../provider/local.storage";
import * as fs from "node:fs";

describe("StorageService", () => {
  let storageService: StorageService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(async () => ({
          STORAGE_TYPE: STORAGE_LOCAL,
          STORAGE_LOCAL_DIR: STORAGE_LOCAL_DIR,
        })),
      ],
      providers: [StorageConfig, StorageService],
    }).compile();

    storageService = await module.get(StorageService);
  });

  beforeEach(async () => {
    await fs.promises.rm(STORAGE_LOCAL_DIR, { force: true, recursive: true });
    await fs.promises.mkdir(STORAGE_LOCAL_DIR);
    await fs.promises.writeFile(
      STORAGE_LOCAL_DIR + "/file.txt",
      EXAMPLE_CONTENT
    );
    await fs.promises.mkdir(STORAGE_LOCAL_DIR + "/files");

    for (let i = 0; i < 4; i++)
      await fs.promises.writeFile(
        `${STORAGE_LOCAL_DIR}/files/${i}.txt`,
        new Uint8Array()
      );

    await fs.promises.mkdir(STORAGE_LOCAL_DIR + "/nested");
    await fs.promises.mkdir(STORAGE_LOCAL_DIR + "/nested/other");
  });

  it("should be defined", () => {
    expect(storageService).toBeDefined();
  });

  it("should instantiate the right storage provider", () => {
    expect(storageService.getInstance()).toBeInstanceOf(LocalStorageProvider);
  });

  describe("when single-file I/O is performed", () => {
    it("should successfully save a file", () => {
      expect(
        storageService.getInstance().putFile("test.txt", EXAMPLE_CONTENT)
      ).resolves.not.toThrow();
    });

    it("should successfully retrieve a file", () => {
      expect(
        storageService.getInstance().getFile("file.txt")
      ).resolves.toHaveProperty("content", EXAMPLE_CONTENT);
    });

    it("should successfully delete a file", () => {
      expect(
        storageService.getInstance().deleteFile("file.txt")
      ).resolves.not.toThrow();
    });

    it("should return null if file does not exist", () => {
      expect(
        storageService.getInstance().getFile("file2.txt")
      ).resolves.toBeNull();
    });
  });

  describe("when multi-file I/O is performed", () => {
    it("should return an array of files in a directory", () => {
      expect(
        storageService.getInstance().getDirectoryFiles("files")
      ).resolves.toHaveProperty("length", 4);
    });

    it("should successfully delete all files in a directory", () => {
      expect(
        storageService.getInstance().deleteDirectoryFiles("files")
      ).resolves.not.toThrow();
    });

    it("should throw an error if a directory contains subdirectories", () => {
      expect(
        storageService.getInstance().deleteDirectoryFiles("nested")
      ).rejects.toBeInstanceOf(Error);
    });

    it("should throw if a file is provided instead of a directory", () => {
      expect(
        storageService.getInstance().getDirectoryFiles("file.txt")
      ).rejects.toBeInstanceOf(Error);
      expect(
        storageService.getInstance().deleteDirectoryFiles("file.txt")
      ).rejects.toBeInstanceOf(Error);
    });
  });

  afterAll(async () => {
    await fs.promises.rm(STORAGE_LOCAL_DIR, { force: true, recursive: true });
  });
});
