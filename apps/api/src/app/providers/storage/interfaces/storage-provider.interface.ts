export interface StorageProvider {
  /**
   * Gets file content in bytes by filename.
   *
   * @param key Filename
   *
   * @returns File content in bytes or null if file does not exist.
   */
  getFile(key: string): Promise<Uint8Array | null>;

  /**
   * Puts a file.
   *
   * @param key Filename
   * @param body File content in bytes
   *
   */

  putFile(key: string, body: Uint8Array);
}
