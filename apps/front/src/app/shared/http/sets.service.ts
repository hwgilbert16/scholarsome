import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SetWithRelations } from "@scholarsome/api-interfaces";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SetsService {
  constructor(private http: HttpClient) {}

  async set(setId: string | null): Promise<SetWithRelations | null> {
    let set: SetWithRelations | undefined;

    try {
      set = await lastValueFrom(this.http.get<SetWithRelations>('/api/sets/' + (setId ? setId : 'self')));
    } catch (e) {
      return null;
    }

    return set;
  }
}
