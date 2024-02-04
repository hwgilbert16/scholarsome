export interface StorageProvider {
  /**
   * Gets file content in bytes by filename.
   *
   * @param path Path to file, relative to root of storage directory
   *
   * @returns File content in bytes or null if file does not exist.
   */
  getFile(path: string): Promise<Uint8Array | null>;

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
   *
   * @returns Every file's content.
   */
  getDirectoryFiles(path: string): Promise<Uint8Array[] | null>;

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
   */
  deleteDirectoryFiles(path: string): Promise<void>;
}
