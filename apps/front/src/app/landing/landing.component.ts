import { Component, OnInit } from '@angular/core';
import { ModalService } from "../shared/modal.service";
import { CookieService } from "ngx-cookie";
import { Router } from "@angular/router";

@Component({
  selector: 'scholarsome-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  constructor(public modalService: ModalService, private cookieService: CookieService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    if (this.cookieService.get('authenticated') === 'true') {
      await this.router.navigate(['view']);
    }
  }
}
