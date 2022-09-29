import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterLinkWithHref } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CookieModule } from "ngx-cookie";

@NgModule({
  imports: [TooltipModule.forRoot(), BsDropdownModule, BrowserAnimationsModule, FontAwesomeModule, RouterLinkWithHref, FormsModule, CookieModule],
  declarations: [FooterComponent, HeaderComponent],
  exports: [FooterComponent, HeaderComponent],
})
export class SharedModule {}
