import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { LandingComponent } from './landing/landing.component';
import { AppRoutes } from './app.routes';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CookieModule } from 'ngx-cookie';
import { faCaretSquareLeft, faClone, faUser, faPlusSquare, faTrashCan, faArrowAltCircleUp,faArrowAltCircleDown } from "@fortawesome/free-regular-svg-icons";
import { CreateModule } from "./create/create.module";

@NgModule({
  declarations: [AppComponent, LandingComponent],
  imports: [
    CreateModule,
    BrowserModule,
    HttpClientModule,
    SharedModule,
    FontAwesomeModule,
    RouterModule.forRoot(AppRoutes, {enableTracing: true}),
    ModalModule.forRoot(),
    CookieModule.withOptions(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faClone, faUser, faCaretSquareLeft, faPlusSquare, faTrashCan, faArrowAltCircleUp, faArrowAltCircleDown);
  }
}
