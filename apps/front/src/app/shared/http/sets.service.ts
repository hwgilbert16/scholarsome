import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { ApiResponse, ApiResponseOptions, Set } from "@scholarsome/shared";

@Injectable({
  providedIn: "root"
})
export class SetsService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Finds a unique set
   *
   * @param setId ID of the set to find
   *
   * @returns Queried `Set` object
   */
  async set(setId: string): Promise<Set | null> {
    let set: ApiResponse<Set> | undefined;

    try {
      set = await lastValueFrom(this.http.get<ApiResponse<Set>>("/api/sets/" + setId));
    } catch (e) {
      return null;
    }

    if (set.status === ApiResponseOptions.Success) {
      return set.data;
    } else return null;
  }

  /**
   * Finds the sets of a user
   *
   * @param userId ID of the set author
   *
   * @returns Array of `Set` objects
   */
  async sets(userId: string): Promise<Set[] | null> {
    let sets: ApiResponse<Set[]> | undefined;

    try {
      sets = await lastValueFrom(this.http.get<ApiResponse<Set[]>>("/api/sets/user" + userId));
    } catch (e) {
      return null;
    }

    if (sets.status === ApiResponseOptions.Success) {
      return sets.data;
    } else return null;
  }

  /**
   * Finds the sets of the authenticated user
   *
   * @returns Array of `Set` objects
   */
  async mySets(): Promise<Set[] | null> {
    let sets: ApiResponse<Set[]> | undefined;

    try {
      sets = await lastValueFrom(this.http.get<ApiResponse<Set[]>>("/api/sets/user/me"));
    } catch (e) {
      return null;
    }

    if (sets.status === ApiResponseOptions.Success) {
      return sets.data;
    } else return null;
  }

  async convertSetToApkg(setId: string): Promise<Blob | null> {
    let file: Blob | undefined;

    try {
      file = await lastValueFrom(this.http.get("/api/sets/export/anki/" + setId, { responseType: "blob" }));
    } catch (e) {
      return null;
    }

    return file;
  }

  /**
   * Creates a set
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

    if (set.status === ApiResponseOptions.Success) {
      return set.data;
    } else return null;
  }

  /**
   * Creates a set from an Anki .apkg file
   *
   * @param body.title Title of the set
   * @param body.description Optional, description of the set
   * @param body.private Whether the set should be publicly visible
   * @param body.file The .apkg file to be uploaded
   *
   * @returns Created `Set` object
   */
  async createSetFromApkg(body: {
    title: string;
    description?: string;
    private: boolean;
    file: File
  }): Promise<Set | null> {
    let set: ApiResponse<Set> | undefined;

    const formData = new FormData();
    formData.append("title", body.title);
    if (body.description) formData.append("description", body.description);
    formData.append("private", body.private.toString());
    formData.append("file", body.file);

    try {
      set = await lastValueFrom(this.http.post<ApiResponse<Set>>("/api/sets/apkg", formData));
    } catch (e) {
      return null;
    }

    if (set.status === ApiResponseOptions.Success) {
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
  }): Promise<Set | "tooLarge" | null> {
    let set: HttpResponse<ApiResponse<Set>> | undefined;

    try {
      set = await lastValueFrom(this.http.patch<ApiResponse<Set>>("/api/sets/" + body.id, {
        title: body.title,
        description: body.description,
        private: body.private,
        cards: body.cards
      }, { observe: "response" }));
    } catch (e) {
      return null;
    }

    if (set.status === 413) {
      return "tooLarge";
    } else if (set.body && set.body.status === ApiResponseOptions.Success) {
      return set.body.data;
    } else return null;
  }


  /**
   * Deletes a set
   *
   * @param setId ID of the set
   *
   * @returns Deleted `Set` object
   */
  async deleteSet(setId: string): Promise<Set | null> {
    let set: ApiResponse<Set> | undefined;

    try {
      set = await lastValueFrom(this.http.delete<ApiResponse<Set>>("/api/sets/" + setId));
    } catch (e) {
      return null;
    }

    if (set.status === ApiResponseOptions.Success) {
      return set.data;
    } else return null;
  }
}
