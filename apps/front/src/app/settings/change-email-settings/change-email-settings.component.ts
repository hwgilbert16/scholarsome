import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { ApiResponseOptions } from "@scholarsome/shared";
import { Router } from "@angular/router";

@Component({
  selector: "scholarsome-change-email-settings",
  templateUrl: "./change-email-settings.component.html",
  styleUrls: ["./change-email-settings.component.scss"]
})
export class ChangeEmailSettingsComponent {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  protected clicked = false;
  protected error = false;
  protected notMatching = false;
  protected rateLimit = false;

  async submit(form: NgForm) {
    this.clicked = true;
    this.error = false;
    this.notMatching = false;
    this.rateLimit = false;

    if (form.value["newEmail"] !== form.value["confirmNewEmail"]) {
      this.notMatching = true;
      this.clicked = false;
      return;
    }

    const response = await this.authService.setEmail(
        form.value["newEmail"]
    );

    this.clicked = false;

    switch (response) {
      case ApiResponseOptions.Success:
        form.resetForm();
        this.router.navigate(["/"]);
        break;
      case ApiResponseOptions.Ratelimit:
        this.rateLimit = true;
        break;
      default:
        this.error = true;
    }
  }
}
