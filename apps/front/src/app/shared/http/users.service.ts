import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiResponse, ApiResponseOptions, User } from "@scholarsome/shared";
import { lastValueFrom } from "rxjs";

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
   * @returns `User` object
   */
  async user(userId: string): Promise<User | null> {
    let user: ApiResponse<User> | undefined;

    try {
      user = await lastValueFrom(this.http.get<ApiResponse<User>>("/api/users/" + userId));
    } catch (e) {
      return null;
    }

    if (user.status === ApiResponseOptions.Success) {
      return user.data;
    } else return null;
  }

  /**
   * Makes a request to get the authenticated user
   *
   * @returns `User` object
   */
  async myUser(): Promise<User | null> {
    let user: ApiResponse<User> | undefined;

    try {
      user = await lastValueFrom(this.http.get<ApiResponse<User>>("/api/users/me"));
    } catch (e) {
      return null;
    }

    if (user.status === ApiResponseOptions.Success) {
      return user.data;
    } else return null;
  }
}
