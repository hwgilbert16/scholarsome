import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { Set } from '@scholarsome/shared';

@Injectable({
  providedIn: 'root'
})
export class SetsService {
  constructor(private http: HttpClient) {}

  async set(setId: string | null): Promise<Set | null> {
    let set: Set | undefined;

    try {
      set = await lastValueFrom(this.http.get<Set>('/api/sets/' + (setId ? setId : 'self')));
    } catch (e) {
      return null;
    }

    return set;
  }

  async sets(userId: string | null): Promise<Set[] | null> {
    let sets: Set[] | undefined;

    try {
      sets = await lastValueFrom(this.http.get<Set[]>('/api/sets/user' + userId));
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
  }): Promise<Set | null> {
    let set: Set | undefined;

    try {
      set = await lastValueFrom(this.http.post<Set>('/api/sets', {
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
  }): Promise<Set | null> {
    let set: Set | undefined;

    try {
      set = await lastValueFrom(this.http.put<Set>('/api/sets/' + body.id, {
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
