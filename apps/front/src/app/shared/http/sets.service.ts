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

  async sets(userId: string | null): Promise<SetWithRelations[] | null> {
    let sets: SetWithRelations[] | undefined;

    try {
      sets = await lastValueFrom(this.http.get<SetWithRelations[]>('/api/sets/user' + userId));
    } catch (e) {
      return null;
    }

    return sets;
  }

  async createSet(body: {
    title: string;
    description?: string;
    private: boolean;
    cards: {
      index: number;
      term: string;
      definition: string;
    }[];
  }): Promise<SetWithRelations | null> {
    let set: SetWithRelations | undefined;

    try {
      set = await lastValueFrom(this.http.post<SetWithRelations>('/api/sets', {
        title: body.title,
        description: body.description,
        private: body.private,
        cards: body.cards
      }));
    } catch (e) {
      return null;
    }

    return set;
  }

  async updateSet(body: {
    id: string;
    title?: string;
    description?: string;
    private?: string;
    cards?: {
      id: string;
      index: number;
      term: string;
      definition: string;
    }[];
  }): Promise<SetWithRelations | null> {
    let set: SetWithRelations | undefined;

    try {
      set = await lastValueFrom(this.http.put<SetWithRelations>('/api/sets/' + body.id, {
        title: body.title,
        description: body.description,
        private: body.private,
        cards: body.cards
      }));
    } catch (e) {
      return null;
    }

    return set;
  }
}
