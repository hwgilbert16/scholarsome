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

  @ViewChild("loginForm") loginForm: NgForm;
  @ViewChild("registerForm") registerForm: NgForm;
  @ViewChild("forgotForm") forgotForm: NgForm;
  @ViewChild("setPasswordForm") setPasswordForm: NgForm;

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

  faGithub = faGithub;
  hidden = false;

  ApiResponseOptions = ApiResponseOptions;

  /**
   * @ignore
   */
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly modalService: ModalService,
    private readonly authService: AuthService,
    private readonly deviceService: DeviceDetectorService,
    private readonly router: Router,
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

  async submitLogout() {
    await this.authService.logout();
    window.location.replace("/");
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

      this.forgotClicked = false;
    });
  }

  ngAfterViewInit(): void {
    if (this.verificationResult) this.modalRef = this.bsModalService.show(this.loginModal);
  }
}
