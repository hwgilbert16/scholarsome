import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterLinkWithHref } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CookieModule } from "ngx-cookie";
import { AlertComponent } from "./alert/alert.component";
import { AlertModule } from "ngx-bootstrap/alert";
import { CommonModule } from "@angular/common";
import { NotfoundComponent } from "./notfound/notfound.component";
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
import { CardComponent } from "./card/card.component";

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
    RecaptchaV3Module
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: "6LfqLcgiAAAAAJDsjWEEywU_kyb4w_jr4VjvJljW"
    }
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
