import { NgModule } from "@angular/core";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterLink, RouterLinkWithHref } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CookieModule } from "ngx-cookie";
import { AlertComponent } from "./alert/alert.component";
import { AlertModule } from "ngx-bootstrap/alert";
import { CommonModule } from "@angular/common";
import { NotfoundComponent } from "./notfound/notfound.component";
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
import { CardComponent } from "./card/card.component";
import { SharedService } from "./shared.service";
import { QuillEditorComponent } from "ngx-quill";

@NgModule({
  imports: [
    TooltipModule.forRoot(),
    BsDropdownModule,
    FontAwesomeModule,
    RouterLinkWithHref,
    FormsModule,
    CookieModule,
    AlertModule,
    CommonModule,
    RecaptchaV3Module,
    RouterLink,
    QuillEditorComponent
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: process.env["SCHOLARSOME_RECAPTCHA_SITE"]
    },
    SharedService
  ],
  declarations: [
    AlertComponent,
    NotfoundComponent,
    CardComponent
  ],
  exports: [AlertComponent, CardComponent]
})
export class SharedModule {}
