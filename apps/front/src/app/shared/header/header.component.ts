import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgForm } from "@angular/forms";
import { ModalService } from "../modal.service";
import { AuthService } from "../../auth/auth.service";
import { CookieService } from "ngx-cookie";
import { HttpResponse } from "@angular/common/http";
import { LoginFormCaptcha, RegisterFormCaptcha } from "../models/Auth";

@Component({
  selector: 'scholarsome-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('register')
  registerModal: TemplateRef<any>

  @ViewChild('loginForm')
  loginForm: NgForm

  @ViewChild('registerForm')
  registerForm: NgForm

  modalRef?: BsModalRef;

  invalidLogin = false;

  loginReq: HttpResponse<LoginFormCaptcha> | number | null;
  registrationReq: HttpResponse<RegisterFormCaptcha> | number | null;

  constructor(
    private bsModalService: BsModalService,
    private modalService: ModalService,
    private authService: AuthService,
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
    this.loginReq = 0;
    this.loginReq = await this.authService.login(form.value);

    if (this.loginReq === 200) {
      window.location.assign('view');
    } else return;
  }

  async submitRegister(form: NgForm) {
    this.registrationReq = 0;
    this.registrationReq = await this.authService.register(form.value);

    if (this.registrationReq === 201) {
      window.location.assign('/view');
    } else return;
  }

  submitLogout() {
    this.authService.logout().subscribe(() => window.location.replace('/'));
  }

  ngOnInit(): void {
    this.bsModalService.onHide.subscribe(() => {
      this.loginReq = null;
      this.registrationReq = null;
    })
  }
}
