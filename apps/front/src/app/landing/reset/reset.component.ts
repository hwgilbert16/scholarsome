import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { CookieService } from "ngx-cookie";

@Component({
  selector: "scholarsome-reset",
  templateUrl: "./reset.component.html",
  styleUrls: ["./reset.component.scss"]
})
export class ResetComponent {
  constructor(
    private readonly authService: AuthService,
    public readonly cookieService: CookieService
  ) {}

  @ViewChild("resetForm") resetForm: NgForm;

  resetRes: string;
  resetClicked = false;

  async submitReset(form: NgForm) {
    this.resetRes = "";
    this.resetRes = await this.authService.sendPasswordReset(form.value);
  }

  async setPassword(form: NgForm) {
    this.resetRes = "";
    this.resetRes = await this.authService.setPassword(form.value);
  }
}
