import { Component, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "scholarsome-profile-picture-modal",
  templateUrl: "./profile-picture-modal.component.html",
  styleUrls: ["./profile-picture-modal.component.scss"]
})
export class ProfilePictureModalComponent {
  constructor(
    private readonly bsModalService: BsModalService
  ) {}

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  protected modalRef?: BsModalRef;

  public open(): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    return this.modalRef;
  }
}
