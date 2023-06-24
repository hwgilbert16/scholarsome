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
import { faQ, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { SetsService } from "../http/sets.service";
import { SharedService } from "../shared.service";
import packageJson from "../../../../../../package.json";

@Component({
  selector: "scholarsome-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild("register") registerModal: TemplateRef<HTMLElement>;
  @ViewChild("login") loginModal: TemplateRef<HTMLElement>;
  @ViewChild("forgot") forgotModal: TemplateRef<HTMLElement>;
  @ViewChild("setPassword") setPasswordModal: TemplateRef<HTMLElement>;
  @ViewChild("importSet") importSetModal: TemplateRef<HTMLElement>;

  @ViewChild("loginForm") loginForm: NgForm;
  @ViewChild("registerForm") registerForm: NgForm;
  @ViewChild("forgotForm") forgotForm: NgForm;
  @ViewChild("setPasswordForm") setPasswordForm: NgForm;

  protected readonly packageJson = packageJson;
  protected readonly window = window;

  updateAvailable: boolean;
  releaseUrl: string;

  modalRef?: BsModalRef;
  isMobile: boolean;

  verificationResult: boolean | null;

  loginRes: string;
  loginClicked = false;

  registrationRes: string;
  registrationConfirmationRequired: boolean;
  registrationClicked = false;

  forgotClicked = false;

  setPasswordClicked = false;
  setPasswordNotMatching = false;

  importSetClicked = false;
  importSetRes: string;

  faGithub = faGithub;
  hidden = false;

  signedIn = false;

  ApiResponseOptions = ApiResponseOptions;
  faQ = faQ;
  faArrowRightFromBracket = faArrowRightFromBracket;

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
    public readonly cookieService: CookieService,
    private readonly sharedService: SharedService
  ) {
    this.modalService.modal.subscribe((e) => {
      switch (e) {
        case "register-open":
          this.modalRef = this.bsModalService.show(this.registerModal);
          break;
        case "login-open":
          this.modalRef = this.bsModalService.show(this.loginModal);
          break;
        case "set-password-open":
          this.modalRef = this.bsModalService.show(this.setPasswordModal, { keyboard: false, ignoreBackdropClick: true });
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

    if (this.loginRes === ApiResponseOptions.Success) {
      window.location.assign("homepage");
    } else {
      this.loginClicked = false;
    }
  }

  async submitRegister(form: NgForm) {
    this.registrationRes = "";
    this.registrationClicked = true;
    this.registrationRes = await this.authService.register(form.value);

    this.registrationClicked = false;
  }

  async submitForgot(form: NgForm) {
    this.forgotClicked = true;
    await this.authService.sendPasswordReset(form.value);
  }

  async submitSetPassword(form: NgForm) {
    this.setPasswordNotMatching = false;
    this.setPasswordClicked = true;

    if (form.value["password"] !== form.value["confirmPassword"]) {
      this.setPasswordClicked = false;
      this.setPasswordNotMatching = true;
      return;
    }

    await this.authService.setPassword(form.value);
    this.modalRef?.hide();
    this.bsModalService.show(this.loginModal);
  }

  async submitImportSet(form: NgForm) {
    this.importSetClicked = true;
    this.importSetRes = "";

    const exported = form.value["importSet"].substring(0, form.value["importSet"].length - 1).split(";");

    // need to add a regex check here to ensure pattern is valid

    if (exported.length < 1) {
      this.importSetRes = "pattern";
      this.importSetClicked = false;
      return;
    }

    const cards: { index: number; term: string; definition: string; }[] = [];

    for (let i = 0; i < exported.length; i++) {
      const split = exported[i].split("\t");

      cards.push({
        index: i,
        term: split[0],
        definition: split[1]
      });
    }

    const set = await this.setsService.createSet({
      title: form.value["importTitle"],
      private: form.value["importPrivateCheck"] === true,
      cards: cards
    });

    if (set) {
      window.location.replace("/study-set/" + set.id);
    } else {
      this.importSetRes = "pattern";
      this.importSetClicked = false;
      return;
    }
  }

  async submitLogout() {
    await this.authService.logout();
    window.location.replace("/");
  }

  ngOnInit(): void {
    this.sharedService.isUpdateAvailable().then((r) => this.updateAvailable = r);
    this.sharedService.getReleaseUrl().then((r) => this.releaseUrl = r);

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

    if (this.cookieService.get("authenticated")) this.signedIn = true;

    this.bsModalService.onHide.subscribe(() => {
      this.loginRes = "";
      this.loginClicked = false;

      this.registrationRes = "";
      this.registrationClicked = false;
      this.registrationConfirmationRequired = false;

      this.verificationResult = null;

      this.forgotClicked = false;
    });
  }

  ngAfterViewInit(): void {
    if (this.verificationResult) this.modalRef = this.bsModalService.show(this.loginModal);
  }
}
