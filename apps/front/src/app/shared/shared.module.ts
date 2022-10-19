import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkWithHref } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';
import { AlertComponent } from './alert/alert.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound/notfound.component';

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
  ],
  declarations: [
    HeaderComponent,
    AlertComponent,
    NotfoundComponent,
  ],
  exports: [HeaderComponent, AlertComponent],
})
export class SharedModule {}
