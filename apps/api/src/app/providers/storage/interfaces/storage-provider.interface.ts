import { File } from "./file.interface";

export interface StorageProvider {
  /**
   * Gets file content in bytes by filename.
   *
   * @param path Path to file, relative to root of storage directory
   *
   * @throws {Error} A file does not exist.
   *
   * @returns File content in bytes or null if file does not exist.
   */
  getFile(path: string): Promise<File | null>;

  /**
   * Puts a file.
   *
   * @param path Path to file, relative to root of storage directory.
   * @param data File content in bytes.
   *
   */
  putFile(path: string, data: Uint8Array): Promise<void>;

  /**
   * Gets all files in a directory.
   *
   * @param path Path to directory, relative to root of storage directory.
   *
   * @throws {Error} The path provided is a file instead of a directory.
   * @throws {Error} Directory contains nested subdirectories.
   *
   * @returns Every file's content.
   */
  getDirectoryFiles(path: string): Promise<File[]>;

  /**
   * Deletes a file.
   *
   * @param path Path to file, relative to root of storage directory.
   *
   * @throws {Error} The path provided is a directory instead of a file.
   *
   */
  deleteFile(path: string): Promise<void>;

  /**
   * Deletes all files in a directory.
   *
   * @param path Path to directory, relative to root of storage directory.
   *
   * @throws {Error} The path provided is a file instead of a directory.
   * @throws {Error} Directory contains nested subdirectories.
   *
   */
  deleteDirectoryFiles(path: string): Promise<void>;

  /**
   * Checks whether given path is a directory.
   *
   * @param path Path to a file or directory.
   *
   * @returns Is path a directory.
   */
  isDirectory(path: string): Promise<boolean>;

  /**
   * Checks whether given path is a file.
   *
   * @param path Path to a file or directory.
   *
   * @returns Is path a file.
   */
  isFile(path: string): Promise<boolean>;
}
