import { Component, Input, TemplateRef, ViewChild } from "@angular/core";
import { ApiResponseOptions } from "@scholarsome/shared";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ModalService } from "../../shared/modal.service";
import { CookieService } from "ngx-cookie";

@Component({
  selector: "scholarsome-login-modal",
  templateUrl: "./login-modal.component.html",
  styleUrls: ["./login-modal.component.scss"]
})
export class LoginModalComponent {
  constructor(
    private readonly router: Router,
    private readonly bsModalService: BsModalService,
    private readonly authService: AuthService,
    public readonly modalService: ModalService,
    private readonly cookieService: CookieService
  ) {
    this.bsModalService.onHide.subscribe(() => {
      this.response = "";
      this.clicked = false;
      this.verificationResult = false;
    });
  }

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  @Input() verificationResult: boolean | null;

  protected response: string;
  protected clicked = false;

  protected modalRef?: BsModalRef;

  protected readonly ApiResponseOptions = ApiResponseOptions;

  public open(): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    return this.modalRef;
  }

  protected async submit(form: NgForm) {
    this.response = "";
    this.clicked = true;
    this.response = await this.authService.login(form.value);

    if (this.response === ApiResponseOptions.Success) {
      this.modalService.modal.next("authentication_successful");
      await this.router.navigate(["/homepage"]);
    } else {
      this.clicked = false;
    }
  }
}
