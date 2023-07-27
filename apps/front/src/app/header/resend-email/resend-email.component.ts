import { Component } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { ApiResponseOptions } from "@scholarsome/shared";

@Component({
  selector: "scholarsome-resend-email",
  templateUrl: "./resend-email.component.html",
  styleUrls: ["./resend-email.component.scss"]
})
export class ResendEmailComponent {
  constructor(private authService: AuthService) {}

  protected clicked: boolean;
  protected response: ApiResponseOptions;
  protected readonly ApiResponseOptions = ApiResponseOptions;

  async onClick() {
    this.clicked = true;
    this.response = await this.authService.resendVerificationEmail();
    this.clicked = false;
  }
}
