import { Component, EventEmitter, Output, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { UsersService } from "../../shared/http/users.service";
import { DomSanitizer } from "@angular/platform-browser";
import { MediaService } from "../../shared/http/media.service";

@Component({
  selector: "scholarsome-profile-picture-modal",
  templateUrl: "./profile-picture-modal.component.html",
  styleUrls: ["./profile-picture-modal.component.scss"]
})
export class ProfilePictureModalComponent {
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly usersService: UsersService,
    private readonly sanitizer: DomSanitizer,
    private readonly mediaService: MediaService
  ) {}

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;
  @Output() updateAvatarEvent = new EventEmitter();

  protected clicked = false;
  protected newAvatar: File;

  protected error = false;

  protected modalRef?: BsModalRef;

  public open(): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    return this.modalRef;
  }

  protected async submit() {
    this.clicked = true;
    this.error = false;

    this.error = await this.mediaService.setAvatar(this.newAvatar);
    this.clicked = false;
    this.updateAvatarEvent.emit();

    if (this.error) {
      this.modalRef?.hide();
    }
  }

  protected onFileUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      this.newAvatar = files[0];
    }
  }
}
