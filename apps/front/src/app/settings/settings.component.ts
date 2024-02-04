import { Component } from "@angular/core";
import { faImage, faKey } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "scholarsome-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent {
  protected readonly faImage = faImage;
  protected readonly faKey = faKey;
}
