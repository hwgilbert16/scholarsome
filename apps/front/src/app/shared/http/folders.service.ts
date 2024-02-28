import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { ApiResponse, ApiResponseOptions, Folder } from "@scholarsome/shared";

@Injectable({
  providedIn: "root"
})
export class FoldersService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Finds a unique folder
   *
   * @param folderId ID of the folder to find
   *
   * @returns Queried `Folder` object
   */
  async folder(folderId: string): Promise<Folder | null> {
    let folder: ApiResponse<Folder> | undefined;

    try {
      folder = await lastValueFrom(this.http.get<ApiResponse<Folder>>("/api/sets/folders/" + folderId));
    } catch (e) {
      return null;
    }

    if (folder.status === ApiResponseOptions.Success) {
      return folder.data;
    } else return null;
  }

  /**
   * Finds the folders of a user
   *
   * @param folderId ID of the folder author
   *
   * @returns Array of `Folder` objects
   */
  async folders(folderId: string): Promise<Folder[] | null> {
    let folders: ApiResponse<Folder[]> | undefined;

    try {
      folders = await lastValueFrom(this.http.get<ApiResponse<Folder[]>>("/api/sets/folders/user/" + folderId));
    } catch (e) {
      return null;
    }

    if (folders.status === ApiResponseOptions.Success) {
      return folders.data;
    } else return null;
  }

  /**
   * Finds the folders of the authenticated user
   *
   * @returns Array of `Folder` objects
   */
  async myFolders(): Promise<Folder[] | null> {
    let folders: ApiResponse<Folder[]> | undefined;

    try {
      folders = await lastValueFrom(this.http.get<ApiResponse<Folder[]>>("/api/sets/folders/user/me"));
    } catch (e) {
      return null;
    }

    if (folders.status === ApiResponseOptions.Success) {
      return folders.data;
    } else return null;
  }

  /**
   * Creates a folder
   *
   * @param body.title Title of the folder
   * @param body.description Optional, description of the folder
   * @param body.private Whether the folder should be publicly visible
   * @param body.cards Array of the cards of the folder
   * @param body.sets Array of the sets that should be within the folder
   *
   * @returns Created `Folder` object
   */
  async createFolder(body: {
    name: string;
    description?: string;
    color: string;
    private: boolean;
    parentFolderId?: string;
    subfolders?: string[];
    sets?: string[]
  }): Promise<Folder | null> {
    let folder: ApiResponse<Folder> | undefined;

    try {
      folder = await lastValueFrom(this.http.post<ApiResponse<Folder>>("/api/sets/folders", {
        name: body.name,
        description: body.description,
        color: body.color,
        private: body.private,
        parentFolderId: body.parentFolderId,
        subfolders: body.subfolders,
        sets: body.sets
      }));
    } catch (e) {
      return null;
    }

    if (folder.status === ApiResponseOptions.Success) {
      return folder.data;
    } else return null;
  }

  /**
   * Makes a request to update a folder
   *
   * @param body.id ID of the folder to be updated
   * @param body.title Optional, title of the folder
   * @param body.description Optional, description of the folder
   * @param body.private Optional, whether the folder should be publicly visible
   * @param body.sets Optional, array of the sets that should be within the folder
   *
   * @returns Updated `Folder` object
   */
  async updateFolder(body: {
    id: string;
    name?: string;
    description?: string;
    color?: string;
    private?: boolean;
    parentFolderId?: string;
    subfolders?: string[];
    sets?: string[]
  }): Promise<Folder | null> {
    let folder: ApiResponse<Folder> | undefined;

    try {
      folder = await lastValueFrom(this.http.patch<ApiResponse<Folder>>("/api/sets/folders/" + body.id, {
        name: body.name,
        description: body.description,
        color: body.color,
        private: body.private,
        parentFolderId: body.parentFolderId,
        subfolders: body.subfolders,
        sets: body.sets
      }));
    } catch (e) {
      return null;
    }

    if (folder.status === ApiResponseOptions.Success) {
      return folder.data;
    } else return null;
  }


  /**
   * Deletes a folder
   *
   * @param folderId ID of the folder
   *
   * @returns Deleted `Folder` object
   */
  async deleteFolder(folderId: string): Promise<Folder | null> {
    let folder: ApiResponse<Folder> | undefined;

    try {
      folder = await lastValueFrom(this.http.delete<ApiResponse<Folder>>("/api/sets/folders/" + folderId));
    } catch (e) {
      return null;
    }

    if (folder.status === ApiResponseOptions.Success) {
      return folder.data;
    } else return null;
  }
}
