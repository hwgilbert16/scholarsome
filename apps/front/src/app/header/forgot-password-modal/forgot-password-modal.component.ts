import { Component, TemplateRef, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ApiResponseOptions } from "@scholarsome/shared";

@Component({
  selector: "scholarsome-forgot-password-modal",
  templateUrl: "./forgot-password-modal.component.html",
  styleUrls: ["./forgot-password-modal.component.scss"]
})
export class ForgotPasswordModalComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly bsModalService: BsModalService
  ) {
    this.bsModalService.onHide.subscribe(() => {
      this.response = null;
      this.clicked = false;
    });
  }

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  protected clicked = false;
  protected response: ApiResponseOptions | null;

  protected readonly ApiResponseOptions = ApiResponseOptions;
  protected modalRef?: BsModalRef;

  public open(): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    return this.modalRef;
  }

  protected async submit(form: NgForm) {
    this.clicked = true;
    this.response = await this.authService.sendPasswordReset(form.value);
    this.clicked = false;
  }
}
