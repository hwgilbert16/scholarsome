import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ModalService } from "../shared/modal.service";
import { AuthService } from "../auth/auth.service";
import { CookieService } from "ngx-cookie";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { DeviceDetectorService } from "ngx-device-detector";
import { NavigationEnd, Router } from "@angular/router";
import { faQ, faArrowRightFromBracket, faStar, faImage } from "@fortawesome/free-solid-svg-icons";
import { SharedService } from "../shared/shared.service";
import packageJson from "../../../../../package.json";
import { AnkiImportModalComponent } from "./anki-import-modal/anki-import-modal.component";
import { QuizletImportModalComponent } from "./quizlet-import-modal/quizlet-import-modal.component";
import { SetPasswordModalComponent } from "./set-password-modal/set-password-modal.component";
import { LoginModalComponent } from "./login-modal/login-modal.component";
import { ForgotPasswordModalComponent } from "./forgot-password-modal/forgot-password-modal.component";
import { RegisterModalComponent } from "./register-modal/register-modal.component";
import { ProfilePictureModalComponent } from "./profile-picture-modal/profile-picture-modal.component";
import { MediaService } from "../shared/http/media.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { User } from "@scholarsome/shared";
import { UsersService } from "../shared/http/users.service";

@Component({
  selector: "scholarsome-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("ankiImport") ankiImportModal: AnkiImportModalComponent;
  @ViewChild("quizletImport") quizletImportModal: QuizletImportModalComponent;
  @ViewChild("setPassword") setPasswordModal: SetPasswordModalComponent;
  @ViewChild("login") loginModal: LoginModalComponent;
  @ViewChild("forgot") forgotPasswordModal: ForgotPasswordModalComponent;
  @ViewChild("register") registerModal: RegisterModalComponent;
  @ViewChild("profilePicture") profilePictureModal: ProfilePictureModalComponent;

  // Whether an update is available compared to the current running version
  protected updateAvailable: boolean;
  // URL of the new version
  protected releaseUrl: string;

  // Used to show the verify email banner
  protected verificationResult: boolean | null;

  // Whether the header is hidden - hidden on the landing page
  protected hidden = false;

  // If the user is signed in
  protected signedIn = false;

  // URL of avatar
  protected avatarUrl: SafeResourceUrl | null;

  // User object
  protected user: User;

  protected isMobile = false;

  protected modalRef?: BsModalRef;

  protected readonly packageJson = packageJson;
  protected readonly window = window;

  protected readonly faImage = faImage;
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
    private readonly sharedService: SharedService,
    private readonly mediaService: MediaService,
    private readonly sanitizer: DomSanitizer,
    private readonly usersService: UsersService,
    public readonly cookieService: CookieService
  ) {}

  async submitLogout() {
    await this.authService.logout();
    await this.router.navigate(["/"]);
  }

  async viewAvatar() {
    const avatar = await this.mediaService.getAvatar(64, 64);

    if (avatar) {
      this.avatarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(avatar));
    } else {
      // for when users sign out from an account with an avatar and switch to one without one
      this.avatarUrl = null;
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.cookieService.get("authenticated")) {
      // we set this.user here so that it can be checked on every router event and log users out if auth invalid
      // however since header initializes on the homepage, this.user will not be set immediately after login
      // technically this would cause an issue if the tokens were invalid immediately after login
      // however it is more than overwhelmingly likely that any token issues with be on a future page reload when the user is already logged in
      this.signedIn = true;
      const user = await this.usersService.myUser();

      if (user) {
        this.user = user;
      } else {
        this.signedIn = false;
      }
    }

    this.sharedService
        .isUpdateAvailable()
        .then((r) => (this.updateAvailable = r));
    this.sharedService.getReleaseUrl().then((r) => (this.releaseUrl = r));

    this.router.events.subscribe(async (e) => {
      if (e instanceof NavigationEnd) {
        this.hidden = this.router.url === "/" || this.router.url === "/reset";

        if (!this.hidden && this.signedIn) {
          const user = await this.usersService.myUser();

          // if this user was authenticated and is now no longer authenticated, sign them out
          if (this.user && !user) {
            await this.authService.logout();
            await this.router.navigate([""]);
          } else if (user) {
            this.user = user;
          }

          this.profilePictureModal.updateAvatarEvent.subscribe(async () => await this.viewAvatar());
        }
      }
    });

    this.modalService.modal.subscribe((e) => {
      switch (e) {
        case "register-open":
          this.modalRef = this.registerModal.open();
          break;
        case "login-open":
          this.modalRef = this.loginModal.open();
          break;
        case "set-password-open":
          this.modalRef = this.setPasswordModal.open();
          break;
        case "forgot-password-open":
          this.modalRef = this.forgotPasswordModal.open();
          break;
      }
    });

    this.checkIfVerifiedInCookie();

    if (this.deviceService.isMobile()) {
      this.isMobile = true;
    }

    if (this.signedIn && !this.hidden) await this.viewAvatar();

    // Hide modals when the route changes
    this.router.events.subscribe(() => this.modalRef?.hide());
  }

  ngAfterViewInit() {
    this.loginModal.loginEvent.subscribe(async () => {
      this.signedIn = true;
      this.checkIfVerifiedInCookie();
      await this.viewAvatar();
    });

    this.registerModal.registerEvent.subscribe(async () => {
      this.signedIn = true;
      this.checkIfVerifiedInCookie();
      await this.viewAvatar();
    });
  }

  checkIfVerifiedInCookie() {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      if (!cookie.includes("verified")) {
        continue;
      }
      this.verificationResult = cookie.includes("true");
    }
  }

  ngOnDestroy() {
    this.modalService.modal.unsubscribe();
  }
}
