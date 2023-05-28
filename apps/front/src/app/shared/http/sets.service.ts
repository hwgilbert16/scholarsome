import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom, Observable } from "rxjs";
import { ApiResponse, Set } from "@scholarsome/shared";

@Injectable({
  providedIn: "root"
})
export class SetsService {
  /**
   * @ignore
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Makes a request to find a unique set
   *
   * @param setId ID of the set to find
   *
   * @returns Queried `Set` object
   */
  async set(setId: string | null): Promise<Set | null> {
    let set: ApiResponse<Set> | undefined;

    try {
      set = await lastValueFrom(this.http.get<ApiResponse<Set>>("/api/sets/" + (setId ? setId : "self")));
    } catch (e) {
      return null;
    }

    if (set.status === "success") {
      return set.data;
    } else return null;
  }

  set$(setId: string | null): Observable<ApiResponse<Set>> {
    return this.http.get<ApiResponse<Set>>("/api/sets/" + (setId ? setId : "self"));
  }

  /**
   * Makes a request to find the sets of a user
   *
   * @param userId ID of the user
   *
   * @returns Array of `Set` objects
   */
  async sets(userId: string | null): Promise<Set[] | null> {
    let sets: ApiResponse<Set[]> | undefined;

    try {
      sets = await lastValueFrom(this.http.get<ApiResponse<Set[]>>("/api/sets/user/" + userId));
    } catch (e) {
      return null;
    }

    if (sets.status === "success") {
      return sets.data;
    } else return null;
  }

  sets$(userId?: string | null): Observable<ApiResponse<Set[]>> {
    return this.http.get<ApiResponse<Set[]>>("/api/sets/user" + (userId ? userId : "self"));
  }

  /**
   * Makes a request to create a set
   *
   * @param body.title Title of the set
   * @param body.description Optional, description of the set
   * @param body.private Whether the set should be publicly visible
   * @param body.cards Array of the cards of the set
   * @param body.cards.index Index of the card
   * @param body.cards.term Term of the card
   * @param body.cards.definition Definition of the card
   *
   * @returns Created `Set` object
   */
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
    let set: ApiResponse<Set> | undefined;

    try {
      set = await lastValueFrom(this.http.post<ApiResponse<Set>>("/api/sets", {
        title: body.title,
        description: body.description,
        private: body.private,
        cards: body.cards
      }));
    } catch (e) {
      return null;
    }

    if (set.status === "success") {
      return set.data;
    } else return null;
  }

  /**
   * Makes a request to update a set
   *
   * @param body.title Title of the set
   * @param body.description Optional, description of the set
   * @param body.private Optional, whether the set should be publicly visible
   * @param body.cards Optional, array of the cards of the set
   * @param body.cards.id ID of the card
   * @param body.cards.index Index of the card
   * @param body.cards.term Term of the card
   * @param body.cards.definition Definition of the card
   *
   * @returns Updated `Set` object
   */
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
    let set: ApiResponse<Set> | undefined;

    try {
      set = await lastValueFrom(this.http.put<ApiResponse<Set>>("/api/sets/" + body.id, {
        title: body.title,
        description: body.description,
        private: body.private,
        cards: body.cards
      }));
    } catch (e) {
      return null;
    }

    if (set.status === "success") {
      return set.data;
    } else return null;
  }

  async deleteSet(setId: string): Promise<Set | null> {
    let set: ApiResponse<Set> | undefined;

    try {
      set = await lastValueFrom(this.http.delete<ApiResponse<Set>>("/api/sets/" + setId));
    } catch (e) {
      return null;
    }

    if (set.status === "success") {
      return set.data;
    } else return null;
  }
}
