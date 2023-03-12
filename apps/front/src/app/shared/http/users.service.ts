import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UserWithRelations } from "@scholarsome/api-interfaces";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {}

  async user(userId: string | null): Promise<UserWithRelations | null> {
    let user: UserWithRelations | undefined;

    try {
      user = await lastValueFrom(this.http.get<UserWithRelations>('/api/users/' + userId));
    } catch (e) {
      return null;
    }

    return user;
  }
}
