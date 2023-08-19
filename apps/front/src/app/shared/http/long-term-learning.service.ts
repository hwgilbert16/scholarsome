import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { ApiResponse, ApiResponseOptions, LongTermLearning } from "@scholarsome/shared";

@Injectable({
  providedIn: "root"
})
export class LongTermLearningService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Finds a unique LongTermLearning object based on a set ID
   * Gets the user from the cookies
   *
   * @returns Queried `LongTermLearning` object
   */
  async longTermLearning(setId: string): Promise<LongTermLearning | null> {
    let set: ApiResponse<LongTermLearning> | undefined;

    try {
      set = await lastValueFrom(this.http.get<ApiResponse<LongTermLearning>>("/api/long-term-learning/" + setId));
    } catch (e) {
      return null;
    }

    if (set.status === ApiResponseOptions.Success) {
      return set.data;
    } else return null;
  }

  /**
   * Creates a LongTermLearning object
   *
   * @returns Created `LongTermLearning` object
   */
  async createLongTermLearning(setId: string): Promise<LongTermLearning | null> {
    let set: ApiResponse<LongTermLearning> | undefined;

    try {
      set = await lastValueFrom(this.http.post<ApiResponse<LongTermLearning>>("/api/long-term-learning/" + setId, {}));
    } catch (e) {
      return null;
    }

    if (set.status === ApiResponseOptions.Success) {
      return set.data;
    } else return null;
  }
}
