import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header.component";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { RouterLinkWithHref } from "@angular/router";
import { AnkiImportModalComponent } from "./anki-import-modal/anki-import-modal.component";
import { QuizletImportModalComponent } from "./quizlet-import-modal/quizlet-import-modal.component";
import { SetPasswordModalComponent } from "./set-password-modal/set-password-modal.component";
import { AuthModule } from "../auth/auth.module";
import { LoginModalComponent } from "./login-modal/login-modal.component";
import { ForgotPasswordModalComponent } from "./forgot-password-modal/forgot-password-modal.component";
import { RegisterModalComponent } from "./register-modal/register-modal.component";

@NgModule({
  declarations: [
    HeaderComponent,
    AnkiImportModalComponent,
    QuizletImportModalComponent,
    SetPasswordModalComponent,
    LoginModalComponent,
    ForgotPasswordModalComponent,
    RegisterModalComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule,
    FontAwesomeModule,
    FormsModule,
    RouterLinkWithHref,
    AuthModule
  ],
  exports: [HeaderComponent, AnkiImportModalComponent]
})
export class HeaderModule {}
