import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgForm } from "@angular/forms";
import { ModalService } from "../modal.service";
import { AuthService } from "../../auth/auth.service";
import { CookieService } from "ngx-cookie";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { lastValueFrom } from "rxjs";

@Component({
  selector: 'scholarsome-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild('register')
  registerModal: TemplateRef<any>

  @ViewChild('loginForm')
  loginForm: NgForm

  @ViewChild('registerForm')
  registerForm: NgForm

  modalRef?: BsModalRef;

  invalidLogin = false;
  invalidRegistration = false;

  constructor(
    private bsModalService: BsModalService,
    private modalService: ModalService,
    private authService: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
    public cookieService: CookieService,
  ) {
    this.modalService.modal.subscribe(e => {
      if (e === 'register-open') {
        this.modalRef = this.bsModalService.show(this.registerModal);
      }
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsModalService.show(template);
  }

  async submitLogin(form: NgForm) {
    const req = await this.authService.login(form.value);
    this.invalidLogin = false;

    if (!req) {
      this.invalidLogin = true;
      return;
    }

    console.log(req.status);

    if (req.status === 200) {
      window.location.assign('/view');
    } else {
      this.invalidLogin = true;
    }
  }

  submitRegister(form: NgForm) {
    this.authService.register(form.value).subscribe(() => window.location.assign('/view'));
  }

  submitLogout() {
    this.authService.logout().subscribe(() => window.location.replace('/'));
  }
}
