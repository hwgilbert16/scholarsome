import { Component, OnInit } from "@angular/core";
import { ModalService } from "../shared/modal.service";
import { CookieService } from "ngx-cookie";
import { Router } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Location } from "@angular/common";

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
    public readonly modalService: ModalService
  ) {}

  isDesktop: boolean;
  faGithub = faGithub;

  async ngOnInit(): Promise<void> {
    this.isDesktop = this.deviceService.isDesktop();

    if (this.cookieService.get("authenticated") === "true") {
      this.location.go("homepage");
      await this.router.navigate(["homepage"]);
    }
  }
}
