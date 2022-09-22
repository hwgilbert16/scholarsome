import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import { faClone } from '@fortawesome/free-regular-svg-icons';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'quizletbutfree-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private modalService: BsModalService) {}

  faClone = faClone;

  modalRef?: BsModalRef;

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  submitLogin(form: NgForm) {
    console.log(form.value);
  }

  submitRegister(form: NgForm) {
    console.log(form.value);
  }

  ngOnInit(): void {}
}
