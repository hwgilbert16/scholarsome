import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { faClone } from '@fortawesome/free-regular-svg-icons';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgForm } from "@angular/forms";
import { ModalService } from "../modal.service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'quizletbutfree-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('register')
  registerModal!: TemplateRef<any>

  constructor(private bsModalService: BsModalService,
              private modalService: ModalService,
              private authService: AuthService) {
    this.modalService.modal.subscribe(e => {
      if (e === 'register-open') {
        this.modalRef = this.bsModalService.show(this.registerModal);
      }
    })
  }

  modalRef?: BsModalRef;
  faClone = faClone;

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsModalService.show(template);
  }

  submitLogin(form: NgForm) {
    this.authService.login(form.value).subscribe(() => {
      console.log('Logged in');
    })
  }

  submitRegister(form: NgForm) {
    this.authService.register(form.value).subscribe(() => {
      console.log('Registered');
    })
  }

  ngOnInit(): void {}
}
