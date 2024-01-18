import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { ApiResponse, ApiResponseOptions, Set } from "@scholarsome/shared";

@Injectable({
  providedIn: "root"
})
export class ConvertingService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Exports a set to a .txt which can be imported into Quizlet
   *
   * @param setId ID of the set to convert
   * @param sideDiscriminator Character(s) to discriminate between sides of a card in the string
   * @param cardDiscriminator Character(s) to discriminate between cards in the string
   *
   * @returns Blob of the .txt
   */
  async exportSetToQuizletTxt(setId: string, sideDiscriminator: string, cardDiscriminator: string): Promise<Blob | null> {
    let file: Blob | undefined;

    try {
      file = await lastValueFrom(
          this.http.get("/api/converting/export/quizlet/" +
          setId +
          "/" +
          encodeURIComponent(sideDiscriminator) +
          "/" +
          encodeURIComponent(cardDiscriminator), { responseType: "blob" })
      );
    } catch (e) {
      return null;
    }

    return file;
  }

  /**
   * Exports a set to an Anki-compatible .apkg file
   *
   * @param setId ID of the set to convert
   *
   * @returns Blob of the .apkg
   */
  async exportSetToAnkiApkg(setId: string): Promise<Blob | null> {
    let file: Blob | undefined;

    try {
      file = await lastValueFrom(this.http.get("/api/converting/export/anki/" + setId, { responseType: "blob" }));
    } catch (e) {
      return null;
    }

    return file;
  }

  /**
   * Exports a set to a CSV file
   *
   * @param setId ID of the set to convert
   *
   * @returns Blob of the .csv
   */
  async exportSetToCsv(setId: string): Promise<Blob | null> {
    let file: Blob | undefined;

    try {
      file = await lastValueFrom(this.http.get("/api/converting/export/csv/" + setId, { responseType: "blob" }));
    } catch (e) {
      return null;
    }

    return file;
  }

  /**
   * Exports set media to a .zip file
   *
   * @param setId ID of the set to convert
   *
   * @returns Blob of the .zip
   */
  async exportSetMedia(setId: string): Promise<Blob | null> {
    let file: Blob | undefined;

    try {
      file = await lastValueFrom(this.http.get("/api/converting/export/media/" + setId, { responseType: "blob" }));
    } catch (e) {
      return null;
    }

    return file;
  }

  /**
   * Creates a set from a set exported from Quizlet
   *
   * @param body.title Title of the set
   * @param body.description Optional, description of the set
   * @param body.private Whether the set should be publicly visible
   * @param body.sideDiscriminator Character(s) to discriminate between sides of a card in the string
   * @param body.cardDiscriminator Character(s) to discriminate between cards in the string
   * @param body.set The string of text that contains the cards that was exported by Quizlet
   *
   * @returns Blob of the .zip
   */
  async importSetFromQuizletTxt(body: {
    title: string;
    description?: string;
    private: boolean;
    sideDiscriminator: string;
    cardDiscriminator: string;
    set: string
  }): Promise<Set | null> {
    let set: ApiResponse<Set> | undefined;

    try {
      set = await lastValueFrom(this.http.post<ApiResponse<Set>>("/api/converting/import/quizlet", {
        title: body.title,
        description: body.description ? body.description : "",
        private: body.private,
        sideDiscriminator: body.sideDiscriminator,
        cardDiscriminator: body.cardDiscriminator,
        set: body.set
      }));
    } catch (e) {
      return null;
    }

    if (set.status === "success") {
      return set.data;
    } else {
      return null;
    }
  }

  /**
   * Imports a set from an Anki .apkg file
   *
   * @param body.title Title of the set
   * @param body.description Optional, description of the set
   * @param body.private Whether the set should be publicly visible
   * @param body.file The .apkg file to be uploaded
   *
   * @returns Created `Set` object
   */
  async importSetFromAnkiApkg(body: {
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
      set = await lastValueFrom(this.http.post<ApiResponse<Set>>("/api/converting/import/apkg", formData));
    } catch (e) {
      return null;
    }

    if (set.status === ApiResponseOptions.Success) {
      return set.data;
    } else return null;
  }

  /**
   * Imports a set from a .csv file
   *
   * @param body.title Title of the set
   * @param body.description Optional, description of the set
   * @param body.private Whether the set should be publicly visible
   * @param body.file The .csv file to be uploaded
   *
   * @returns Created `Set` object
   */
  async importSetFromCsv(body: {
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
      set = await lastValueFrom(this.http.post<ApiResponse<Set>>("/api/converting/import/csv", formData));
    } catch (e) {
      return null;
    }

    if (set.status === ApiResponseOptions.Success) {
      return set.data;
    } else return null;
  }
}
