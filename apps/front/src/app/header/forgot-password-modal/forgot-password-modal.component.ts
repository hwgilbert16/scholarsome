import { Component, TemplateRef, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "scholarsome-forgot-password-modal",
  templateUrl: "./forgot-password-modal.component.html",
  styleUrls: ["./forgot-password-modal.component.scss"]
})
export class ForgotPasswordModalComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly bsModalService: BsModalService
  ) {}

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  protected clicked = false;

  protected modalRef?: BsModalRef;

  public open(): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    return this.modalRef;
  }

  protected async submit(form: NgForm) {
    this.clicked = true;
    await this.authService.sendPasswordReset(form.value);
  }
}
