import { Component } from "@angular/core";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "scholarsome-resend-email",
  templateUrl: "./resend-email.component.html",
  styleUrls: ["./resend-email.component.scss"]
})
export class ResendEmailComponent {
  clicked: boolean;
  result: {status: string, message: string};

  constructor(private authService: AuthService) {
    this.result = { status: "", message: "" };
  }

  async onClick() {
    this.clicked = true;
    const data = await this.authService.resendVerificationEmail();
    this.result = JSON.parse(JSON.stringify(data)) as {status: string, message: string};
    this.clicked = false;
  }
}
