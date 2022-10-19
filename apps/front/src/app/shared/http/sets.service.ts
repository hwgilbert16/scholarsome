import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SetWithRelations } from "@scholarsome/api-interfaces";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SetsService {
  constructor(private http: HttpClient) {}

  public async set(setId: string): Promise<SetWithRelations | undefined> {
    let set: SetWithRelations | undefined;

    try {
      set = await lastValueFrom(this.http.get<SetWithRelations>('/api/sets/' + setId));
    } catch (e) {
      return undefined;
    }

    return set;
  }
}
