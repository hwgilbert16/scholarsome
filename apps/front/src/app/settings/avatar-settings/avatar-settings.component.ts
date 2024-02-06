import { Component, OnInit } from "@angular/core";
import { MediaService } from "../../shared/http/media.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { SharedService } from "../../shared/shared.service";

@Component({
  selector: "scholarsome-avatar-settings",
  templateUrl: "./avatar-settings.component.html",
  styleUrls: ["./avatar-settings.component.scss"]
})
export class AvatarSettingsComponent implements OnInit {
  constructor(
    private readonly mediaService: MediaService,
    private readonly sanitizer: DomSanitizer,
    private readonly sharedService: SharedService
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
    this.sharedService.avatarUpdateEvent.next();
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
    this.sharedService.avatarUpdateEvent.next();

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
