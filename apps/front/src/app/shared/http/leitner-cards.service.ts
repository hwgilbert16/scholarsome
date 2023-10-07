import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LeitnerCard } from "@prisma/client";
import { ApiResponse, ApiResponseOptions } from "@scholarsome/shared";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LeitnerCardsService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Updates a LeitnerCard
   *
   * @returns Updated `LeitnerCard` object
   */
  async updateLeitnerCard(body: {
    cardId: string,
    box?: number,
    learned?: boolean
  }): Promise<LeitnerCard | null> {
    let card: ApiResponse<LeitnerCard> | undefined;

    try {
      card = await lastValueFrom(this.http.patch<ApiResponse<LeitnerCard>>("/api/leitner-sets/cards/" + body.cardId, {
        box: body.box,
        learned: body.learned
      }));
    } catch (e) {
      return null;
    }

    if (card.status === ApiResponseOptions.Success) {
      return card.data;
    } else return null;
  }
}
