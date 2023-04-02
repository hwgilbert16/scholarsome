import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "@scholarsome/shared";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  /**
   * @ignore
   */
  constructor(private http: HttpClient) {}

  /**
   * Makes a request to find a unique user
   *
   * @param userId ID of the user to find
   *
   * @returns Queried `User` object
   */
  async user(userId: string | null): Promise<User | null> {
    let user: User | undefined;

    try {
      user = await lastValueFrom(this.http.get<User>("/api/users/" + userId));
    } catch (e) {
      return null;
    }

    return user;
  }
}
