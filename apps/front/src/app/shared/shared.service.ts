import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import packageJson from "../../../../../package.json";

@Injectable({
  providedIn: "root"
})
export class SharedService {
  constructor(private readonly http: HttpClient) {
    this.res = lastValueFrom(this.http.get("https://api.github.com/repos/hwgilbert16/scholarsome/releases"));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly res: Promise<any>;

  async isUpdateAvailable(): Promise<boolean> {
    return (await this.res)[0]["name"] !== "v" + packageJson.version;
  }

  async getReleaseUrl(): Promise<string> {
    return (await this.res)[0]["html_url"];
  }
}
