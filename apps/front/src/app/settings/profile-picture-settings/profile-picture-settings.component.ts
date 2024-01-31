import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "scholarsome-profile-picture-settings",
  templateUrl: "./profile-picture-settings.component.html",
  styleUrls: ["./profile-picture-settings.component.scss"]
})
export class ProfilePictureSettingsComponent {
  @Output() updateAvatarEvent = new EventEmitter();

  protected clicked = false;
  protected error = false;

  protected newAvatar: File;
  protected existingAvatar: Blob;

  submit() {

  }

  protected onFileUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      this.newAvatar = files[0];
    }
  }
}
