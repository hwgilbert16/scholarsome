import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgForm } from "@angular/forms";
import { UsersService } from "../../shared/http/users.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "scholarsome-profile-picture-modal",
  templateUrl: "./profile-picture-modal.component.html",
  styleUrls: ["./profile-picture-modal.component.scss"]
})
export class ProfilePictureModalComponent implements OnInit {
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly usersService: UsersService,
    private readonly sanitizer: DomSanitizer
  ) {}

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  protected clicked = false;

  // base64 of avatar
  protected existingAvatar: SafeResourceUrl;
  protected newAvatar: File;

  protected modalRef?: BsModalRef;

  public open(): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    return this.modalRef;
  }

  protected submit(form: NgForm) {
    this.clicked = true;
  }

  protected onFileUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      this.newAvatar = files[0];
    }
  }

  async ngOnInit(): Promise<void> {
    const file = await this.usersService.userProfilePicture("a");

    if (file) {
      this.existingAvatar = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
    }
  }
}
