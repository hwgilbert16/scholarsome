import { Component, OnInit } from '@angular/core';
import { ModalService } from "../shared/modal.service";
import { CookieService } from "ngx-cookie";

@Component({
  selector: 'scholarsome-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  constructor(private modalService: ModalService, private cookieService: CookieService) {}

  openRegister() {
    this.modalService.modal.next('register-open');
  }

  getCookie(key: string) {
    return this.cookieService.get(key);
  }

  ngOnInit() {}
}
