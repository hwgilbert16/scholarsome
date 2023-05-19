import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgForm } from "@angular/forms";
import { ModalService } from "../modal.service";
import { AuthService } from "../../auth/auth.service";
import { CookieService } from "ngx-cookie";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { DeviceDetectorService } from "ngx-device-detector";
import { NavigationEnd, Router } from "@angular/router";
import { ApiResponseOptions } from "@scholarsome/shared";
import { faQ } from "@fortawesome/free-solid-svg-icons";
import { SetsService } from "../http/sets.service";

@Component({
  selector: "scholarsome-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild("register") registerModal: TemplateRef<HTMLElement>;
  @ViewChild("login") loginModal: TemplateRef<HTMLElement>;

  @ViewChild("loginForm") loginForm: NgForm;
  @ViewChild("registerForm") registerForm: NgForm;

  modalRef?: BsModalRef;
  isMobile: boolean;

  verificationResult: boolean | null;

  loginRes: string;
  loginClicked = false;

  registrationRes: string;
  registrationConfirmationRequired: boolean;
  registrationClicked = false;

  importSetRes: string;
  importSetClicked = false;

  faGithub = faGithub;
  hidden = false;

  ApiResponseOptions = ApiResponseOptions;

  faQ = faQ;

  /**
   * @ignore
   */
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly modalService: ModalService,
    private readonly authService: AuthService,
    private readonly deviceService: DeviceDetectorService,
    private readonly router: Router,
    private readonly setsService: SetsService,
    public readonly cookieService: CookieService
  ) {
    this.modalService.modal.subscribe((e) => {
      switch (e) {
        case "register-open":
          this.modalRef = this.bsModalService.show(this.registerModal);
          break;
        case "login-open":
          this.modalRef = this.bsModalService.show(this.loginModal);
          break;
      }
    });
  }

  openModal(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.bsModalService.show(template);
  }

  async submitLogin(form: NgForm) {
    this.loginRes = "";
    this.loginClicked = true;
    this.loginRes = await this.authService.login(form.value);

    if (this.loginRes === ApiResponseOptions.Success) window.location.assign("homepage");
  }

  async submitRegister(form: NgForm) {
    this.registrationRes = "";
    this.registrationClicked = true;
    this.registrationRes = await this.authService.register(form.value);

    this.registrationClicked = false;
  }

  async submitLogout() {
    await this.authService.logout();
    window.location.replace("/");
  }

  async submitImportSet(form: NgForm) {
    this.importSetRes = "";
    this.importSetClicked = true;

    const url = new URL(Object.values(form.value)[0] as string).pathname.split("/")[1];
    if (!url || !(Object.values(form.value)[0] as string).includes("quizlet")) {
      this.importSetRes = "parsing";
      return;
    }

    const conversion = await this.setsService.convertQuizletSet(url);

    if (conversion) {
      window.location.replace("/study-set/" + conversion.id);
    } else {
      this.importSetRes = "fail";
      this.importSetClicked = false;
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.hidden = this.router.url === "/" || this.router.url === "/reset";
      }
    });

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      if (!cookie.includes("verified")) continue;

      this.verificationResult = cookie.includes("true");
    }

    if (this.deviceService.isTablet() || this.deviceService.isMobile()) this.isMobile = true;

    this.bsModalService.onHide.subscribe(() => {
      this.loginRes = "";
      this.loginClicked = false;

      this.registrationRes = "";
      this.registrationClicked = false;
      this.registrationConfirmationRequired = false;

      this.verificationResult = null;
    });
  }

  ngAfterViewInit(): void {
    if (this.verificationResult) this.modalRef = this.bsModalService.show(this.loginModal);
  }
}
