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
   * @param path Path to file, relative to root of storage directory
   * @param data File content in bytes
   *
   */

  putFile(path: string, data: Uint8Array): Promise<void>;
}
