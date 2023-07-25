import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiResponse, User } from "@scholarsome/shared";
import { lastValueFrom, Observable } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  /**
   * @ignore
   */
  constructor(
    private readonly http: HttpClient
  ) {}

  /**
   * Makes a request to find a unique user
   *
   * @param userId ID of the user to find
   *
   * @returns Queried `User` object
   */
  async user(userId: string | null): Promise<User | null> {
    let user: ApiResponse<User> | undefined;

    try {
      user = await lastValueFrom(this.http.get<ApiResponse<User>>("/api/users/" + userId));
    } catch (e) {
      return null;
    }

    if (user.status === "success") {
      return user.data;
    } else return null;
  }

  /**
   * Gets a user profile picture
   *
   * @param userId ID of the user to find the profile picture of
   *
   * @returns Base64 string of image or null if no picture found
   */
  async userProfilePicture(userId: string): Promise<Blob | null> {
    let file;

    try {
      // file = await lastValueFrom(this.http.get("/api/media/avatars/" + userId));
      file = await lastValueFrom(this.http.get("/api/media/sets/080f90e0-956e-43b5-80b2-02866a3f47e7/e79acfa7-8b92-4e7d-b57a-efb005434082.jpeg", { responseType: "blob" }));
    } catch (e) {
      return null;
    }

    return file;
  }

  user$(userId: string | null): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>("/api/users/" + userId);
  }
}
