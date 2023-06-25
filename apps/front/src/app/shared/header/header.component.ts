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
import { faQ, faArrowRightFromBracket, faStar } from "@fortawesome/free-solid-svg-icons";
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
  @ViewChild("setPassword") setPasswordModal: TemplateRef<HTMLElement>;

  // Whether an update is available compared to the current running version
  protected updateAvailable: boolean;
  // URL of the new version
  protected releaseUrl: string;

  // Used to open the login modal after users verify their email
  protected verificationResult: boolean | null;

  /* Login form */

  // Status from API response body
  protected loginRes: string;
  // Whether the login submit button has been clicked
  protected loginClicked = false;

  /* */

  /* Register form */

  protected registrationRes: string;
  // Whether email confirmation is required
  // Needed as selfhosted installs do not use email confirmation
  protected registrationConfirmationRequired: boolean;
  protected registrationClicked = false;

  /* */

  /* Forgot form */

  protected forgotClicked = false;

  /* */

  /* Set password form */
  // This is the form that is shown to users to reset their password
  // after clicking the link in their email

  protected setPasswordClicked = false;
  // Whether the two passwords do not match
  protected setPasswordNotMatching = false;

  /* */

  /* Quizlet import form */

  protected quizletImportClicked = false;
  protected quizletImportRes: string;

  /* */

  /* Anki import form */

  protected ankiImportClicked = false;
  protected ankiImportRes: string;
  protected ankiApkgFile: File | null = null;

  /* */

  // Whether the header is hidden - hidden on the landing page
  protected hidden = false;

  // If the user is signed in
  protected signedIn = false;

  protected isMobile = false;

  protected modalRef?: BsModalRef;

  protected readonly packageJson = packageJson;
  protected readonly window = window;
  protected readonly ApiResponseOptions = ApiResponseOptions;
  protected readonly faQ = faQ;
  protected readonly faGithub = faGithub;
  protected readonly faStar = faStar;
  protected readonly faArrowRightFromBracket = faArrowRightFromBracket;

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
    private readonly sharedService: SharedService,
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
      await this.router.navigate(["/homepage"]);
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

  onAnkiFileUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      this.ankiApkgFile = files[0];
    }
  }

  async submitAnkiImport(form: NgForm) {
    this.ankiImportClicked = true;
    this.ankiImportRes = "";

    if (!this.ankiApkgFile) return;

    const set = await this.setsService.createSetFromApkg({
      title: form.value["title"],
      description: form.value["description"],
      private: form.value["privateCheck"] === true,
      file: this.ankiApkgFile
    });

    if (set) {
      await this.router.navigate(["/study-set/" + set.id]);
    } else {
      this.ankiImportRes = "incompatible";
      this.ankiImportClicked = false;
      return;
    }
  }

  async submitQuizletImport(form: NgForm) {
    this.quizletImportClicked = true;
    this.quizletImportRes = "";

    const exported = form.value["importSet"].substring(0, form.value["importSet"].length - 1).split(";");

    // need to add a regex check here to ensure pattern is valid

    if (exported.length < 1) {
      // quizletImportRes set to pattern indicates that the pattern is invalid
      this.quizletImportRes = "pattern";
      this.quizletImportClicked = false;
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
      title: form.value["title"],
      description: form.value["description"],
      private: form.value["privateCheck"] === true,
      cards: cards
    });

    if (set) {
      await this.router.navigate(["/study-set/" + set.id]);
    } else {
      this.quizletImportRes = "pattern";
      this.quizletImportClicked = false;
      return;
    }
  }

  async submitLogout() {
    await this.authService.logout();
    await this.router.navigate(["/"]);
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

    // Remove form data when modals are closed
    this.bsModalService.onHide.subscribe(() => {
      this.loginRes = "";
      this.loginClicked = false;

      this.registrationRes = "";
      this.registrationClicked = false;
      this.registrationConfirmationRequired = false;

      this.quizletImportRes = "";

      this.ankiApkgFile = null;
      this.ankiImportRes = "";

      this.verificationResult = null;

      this.forgotClicked = false;
    });

    // Hide modals when the route changes
    this.router.events.subscribe(() => this.modalRef?.hide());
  }

  ngAfterViewInit(): void {
    if (this.verificationResult) this.modalRef = this.bsModalService.show(this.loginModal);
  }
}
