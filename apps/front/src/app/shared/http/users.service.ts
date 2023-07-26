import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiResponse, User } from "@scholarsome/shared";
import { lastValueFrom, Observable } from "rxjs";

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
  async user(userId?: string): Promise<User | null> {
    let user: ApiResponse<User> | undefined;

    try {
      if (userId) {
        user = await lastValueFrom(this.http.get<ApiResponse<User>>("/api/users/" + userId));
      } else {
        user = await lastValueFrom(this.http.get<ApiResponse<User>>("/api/users/self"));
      }
    } catch (e) {
      return null;
    }

    if (user.status === "success") {
      return user.data;
    } else return null;
  }

  user$(userId: string | null): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>("/api/users/" + userId);
  }
}
