import { Component, OnInit } from "@angular/core";
import { MediaService } from "../../shared/http/media.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "scholarsome-profile-picture-settings",
  templateUrl: "./profile-picture-settings.component.html",
  styleUrls: ["./profile-picture-settings.component.scss"]
})
export class ProfilePictureSettingsComponent implements OnInit {
  constructor(
    private readonly mediaService: MediaService,
    private readonly sanitizer: DomSanitizer
  ) {}

  protected changeClicked = false;
  protected changeError = false;

  protected deleteClicked = false;

  protected newAvatar: File;
  protected existingAvatarUrl: SafeResourceUrl | null;

  async submit() {
    this.changeClicked = true;
    this.changeError = false;

    const response = await this.mediaService.setAvatar(this.newAvatar);

    this.changeError = !response;

    this.changeClicked = false;

    await this.viewAvatar();
  }

  async viewAvatar() {
    const avatar = await this.mediaService.getMyAvatar(128, 128);

    if (avatar) {
      this.existingAvatarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(avatar));
    } else {
      this.existingAvatarUrl = null;
    }
  }

  async deleteAvatar() {
    this.deleteClicked = true;

    await this.mediaService.deleteMyAvatar();

    this.existingAvatarUrl = null;
    this.deleteClicked = false;
  }

  protected onFileUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      this.newAvatar = files[0];
    }
  }

  async ngOnInit(): Promise<void> {
    await this.viewAvatar();
  }
}
