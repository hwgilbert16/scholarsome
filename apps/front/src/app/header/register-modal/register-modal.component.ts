import { Component, EventEmitter, Output, TemplateRef, ViewChild } from "@angular/core";
import { ApiResponseOptions } from "@scholarsome/shared";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ModalService } from "../../shared/modal.service";
import { Router } from "@angular/router";

@Component({
  selector: "scholarsome-register-modal",
  templateUrl: "./register-modal.component.html",
  styleUrls: ["./register-modal.component.scss"]
})
export class RegisterModalComponent {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly bsModalService: BsModalService,
    public readonly modalService: ModalService
  ) {
    this.bsModalService.onHide.subscribe(() => {
      this.response = "";
      this.clicked = false;
    });
  }

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;
  @Output() registerEvent = new EventEmitter();

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
    this.response = await this.authService.register(form.value);

    if (this.response === ApiResponseOptions.Success) {
      await this.router.navigate(["/homepage"]);
      this.registerEvent.emit();
    }

    this.clicked = false;
  }
}
