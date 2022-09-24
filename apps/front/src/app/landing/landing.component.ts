import { Component, OnInit } from '@angular/core';
import { ModalService } from "../shared/modal.service";

@Component({
  selector: 'quizletbutfree-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  constructor(private modalService: ModalService) {}

  openRegister() {
    this.modalService.modal.next('register-open');
  }

  ngOnInit(): void {}
}
