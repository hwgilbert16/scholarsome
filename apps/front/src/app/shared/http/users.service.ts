import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "@scholarsome/shared";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  constructor(private http: HttpClient) {}

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
