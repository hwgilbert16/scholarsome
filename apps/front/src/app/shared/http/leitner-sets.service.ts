import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { ApiResponse, ApiResponseOptions, LeitnerSet } from "@scholarsome/shared";

@Injectable({
  providedIn: "root"
})
export class LeitnerSetsService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Finds a unique LeitnerSet object based on a set ID
   * Gets the user from the cookies
   *
   * @returns Queried `LeitnerSet` object
   */
  async leitnerSet(setId: string): Promise<LeitnerSet | null> {
    let set: ApiResponse<LeitnerSet> | undefined;

    try {
      set = await lastValueFrom(this.http.get<ApiResponse<LeitnerSet>>("/api/leitner-sets/" + setId));
    } catch (e) {
      return null;
    }

    if (set.status === ApiResponseOptions.Success) {
      return set.data;
    } else return null;
  }

  /**
   * Creates a LeitnerSet
   *
   * @returns Created `LeitnerSet` object
   */
  async createLeitnerSet(setId: string): Promise<LeitnerSet | null> {
    let set: ApiResponse<LeitnerSet> | undefined;

    try {
      set = await lastValueFrom(this.http.post<ApiResponse<LeitnerSet>>("/api/leitner-sets/" + setId, {}));
    } catch (e) {
      return null;
    }

    if (set.status === ApiResponseOptions.Success) {
      return set.data;
    } else return null;
  }

  /**
   * Updates a LeitnerSet
   *
   * @returns Updated `LeitnerSet` object
   */
  async updateLeitnerSet(body: {
    setId: string,
    cardsPerSession?: number,
    unlearnedCards?: string[],
    studySessionStartedAt?: Date
  }): Promise<LeitnerSet | null> {
    let set: ApiResponse<LeitnerSet> | undefined;

    try {
      set = await lastValueFrom(this.http.put<ApiResponse<LeitnerSet>>("/api/leitner-sets/" + body.setId, {
        cardsPerSession: body.cardsPerSession,
        unlearnedCards: body.unlearnedCards,
        studySessionStartedAt: body.studySessionStartedAt
      }));
    } catch (e) {
      return null;
    }

    if (set.status === ApiResponseOptions.Success) {
      return set.data;
    } else return null;
  }
}
