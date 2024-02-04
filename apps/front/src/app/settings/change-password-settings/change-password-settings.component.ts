import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { ApiResponseOptions } from "@scholarsome/shared";

@Component({
  selector: "scholarsome-change-password-settings",
  templateUrl: "./change-password-settings.component.html",
  styleUrls: ["./change-password-settings.component.scss"]
})
export class ChangePasswordSettingsComponent {
  constructor(private readonly authService: AuthService) {}

  protected clicked = false;
  protected error = false;
  protected invalidPassword = false;
  protected notMatching = false;
  protected success = false;

  async submit(form: NgForm) {
    this.clicked = true;
    this.error = false;
    this.notMatching = false;
    this.success = false;

    if (form.value["newPassword"] !== form.value["confirmNewPassword"]) {
      this.notMatching = true;
      this.clicked = false;
      return;
    }

    const response = await this.authService.setPasswordAuthenticated(
        form.value["existingPassword"],
        form.value["newPassword"]
    );

    this.clicked = false;

    switch (response) {
      case ApiResponseOptions.Success:
        this.success = true;
        form.resetForm();
        break;
      case ApiResponseOptions.Incorrect:
        this.invalidPassword = true;
        break;
      default:
        this.error = true;
    }
  }
}
