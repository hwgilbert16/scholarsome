import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { faClone, faUser, faCaretSquareLeft } from '@fortawesome/free-regular-svg-icons';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgForm } from "@angular/forms";
import { ModalService } from "../modal.service";
import { AuthService } from "../../auth/auth.service";
import { CookieService } from "ngx-cookie";

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

  constructor(
    private bsModalService: BsModalService,
    private modalService: ModalService,
    private authService: AuthService,
    private cookieService: CookieService
  ) {
    this.modalService.modal.subscribe(e => {
      if (e === 'register-open') {
        this.modalRef = this.bsModalService.show(this.registerModal);
      }
    })
  }

  modalRef?: BsModalRef;

  getCookie(key: string) {
    return this.cookieService.get(key);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsModalService.show(template);
  }

  submitLogin(form: NgForm) {
    this.authService.login(form.value).subscribe(() => {
      this.modalRef?.hide();
      window.location.reload();
    })
  }

  submitRegister(form: NgForm) {
    this.authService.register(form.value).subscribe(() => {
      console.log('Registered');
    })
  }

  submitLogout() {
    this.authService.logout().subscribe(() => {
      window.location.reload();
    })
  }

  ngOnInit() {}
}
