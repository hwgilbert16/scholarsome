import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
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
    RouterLink
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: process.env["SCHOLARSOME_RECAPTCHA_SITE"]
    },
    SharedService
  ],
  declarations: [
    HeaderComponent,
    AlertComponent,
    NotfoundComponent,
    CardComponent
  ],
  exports: [HeaderComponent, AlertComponent, CardComponent]
})
export class SharedModule {}
