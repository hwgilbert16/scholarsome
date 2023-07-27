import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MediaService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Gets a user avatar file
   *
   * @param userId Optional, ID of the user. Endpoint will use ID in cookies if no ID is provided.
   */
  async getAvatar(width?: number, height?: number, userId?: string): Promise<Blob | false> {
    let response;

    try {
      response = await lastValueFrom(
          this.http.get("/api/media/avatars/" +
            (userId ? userId : "") +
            "?width=" + (width ? width : "") +
            "&height=" + (height ? height : ""),
          { responseType: "blob" })
      );
    } catch (e) {
      return false;
    }

    return response;
  }

  /**
   * Uploads a user avatar
   *
   * @param avatar Image file
   * @param userId ID of the user
   *
   * @returns Boolean of whether the operation was successful
   */
  async setAvatar(avatar: File): Promise<boolean> {
    const formData = new FormData();
    formData.append("file", avatar);

    try {
      await lastValueFrom(this.http.post("/api/media/avatars", formData));
    } catch (e) {
      return false;
    }

    return true;
  }
}
