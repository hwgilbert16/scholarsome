import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom, Subject } from "rxjs";
import packageJson from "../../../../../package.json";

@Injectable({
  providedIn: "root"
})
export class SharedService {
  constructor(private readonly http: HttpClient) {
    this.releaseCheckRes = lastValueFrom(this.http.get("https://api.github.com/repos/hwgilbert16/scholarsome/releases"));
    this.starsRes = lastValueFrom(this.http.get("https://api.github.com/repos/hwgilbert16/scholarsome"));
  }

  public avatarUpdateEvent = new Subject<void>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly releaseCheckRes: Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly starsRes: Promise<any>;

  async isUpdateAvailable(): Promise<boolean> {
    return (await this.releaseCheckRes)[0]["name"] !== "v" + packageJson.version;
  }

  async getReleaseUrl(): Promise<string> {
    return (await this.releaseCheckRes)[0]["html_url"];
  }

  async getStargazers(): Promise<number> {
    return (await this.starsRes)["stargazers_count"];
  }
}
