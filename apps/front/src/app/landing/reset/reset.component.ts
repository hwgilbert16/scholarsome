import { Component, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { HttpResponse } from "@angular/common/http";
import { ResetForm } from "../../shared/models/Auth";
import { AuthService } from "../../auth/auth.service";
import { CookieService } from "ngx-cookie";

@Component({
  selector: 'scholarsome-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent {
  constructor(private authService: AuthService, public cookieService: CookieService) {}

  @ViewChild('resetForm') resetForm: NgForm;

  resetReq: HttpResponse<ResetForm> | number | null;

  async submitReset(form: NgForm) {
    this.resetReq = 0;
    this.resetReq = await this.authService.submitResetPassword(form.value);
  }

  async setPassword(form: NgForm) {
    this.resetReq = 0;
    this.resetReq = await this.authService.setPassword(form.value);
    console.log(this.resetReq);
  }
}
