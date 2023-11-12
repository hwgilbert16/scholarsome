import { Component, OnInit } from "@angular/core";
import { ModalService } from "../shared/modal.service";
import { CookieService } from "ngx-cookie";
import { Router } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Location } from "@angular/common";
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: "scholarsome-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"]
})
export class LandingComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(
    private readonly cookieService: CookieService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly deviceService: DeviceDetectorService,
    private readonly titleService: Title,
    private readonly metaService: Meta,
    public readonly modalService: ModalService
  ) {
    this.titleService.setTitle("Studying done the correct way — Scholarsome");
    this.metaService.addTag({ name: "description", content: "Scholarsome is the way studying was meant to be. No monthly fees or upsells to get between you and your study tools. Just flashcards." });
  }

  isDesktop: boolean;
  faGithub = faGithub;

  async ngOnInit(): Promise<void> {
    this.isDesktop = this.deviceService.isDesktop();

    if (this.cookieService.get("authenticated") === "true") {
      this.location.go("homepage");
      await this.router.navigate(["homepage"]);
    }

    if (this.cookieService.get("resetPasswordToken")) {
      this.modalService.modal.next("set-password-open");
    }
  }
}
