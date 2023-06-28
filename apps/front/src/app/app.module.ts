import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "./shared/shared.module";
import {
  FontAwesomeModule,
  FaIconLibrary
} from "@fortawesome/angular-fontawesome";
import { ModalModule } from "ngx-bootstrap/modal";
import { CookieModule } from "ngx-cookie";
import {
  faCaretSquareLeft,
  faClone,
  faUser,
  faPlusSquare,
  faTrashCan,
  faArrowAltCircleUp,
  faArrowAltCircleDown,
  faCheckSquare,
  faEyeSlash,
  faCircleQuestion,
  faPenToSquare,
  faComments,
  faFlag,
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faRectangleList
} from "@fortawesome/free-regular-svg-icons";
import { CreateModule } from "./create/create.module";
import { AppRoutingModule } from "./app-routing.module";
import { LandingModule } from "./landing/landing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { ProfileModule } from "./profile/profile.module";
import { HeadScriptsComponent } from "./head-scripts/head-scripts.component";
import { QuillConfigModule, QuillModule } from "ngx-quill";

@NgModule({
  declarations: [AppComponent, HeadScriptsComponent],
  imports: [
    CreateModule,
    LandingModule,
    BrowserModule,
    HttpClientModule,
    SharedModule,
    FontAwesomeModule,
    ModalModule.forRoot(),
    CookieModule.withOptions(),
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    ProfileModule,
    QuillModule.forRoot(),
    QuillConfigModule.forRoot({
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ "header": 1 }, { "header": 2 }],
          [{ color: [] }, { background: [] }],
          [{ "script": "sub" }, { "script": "super" }],
          ["link", "image", "video"],
          ["clean"]
        ]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent, HeadScriptsComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
        faClone,
        faUser,
        faCaretSquareLeft,
        faPlusSquare,
        faTrashCan,
        faArrowAltCircleUp,
        faArrowAltCircleDown,
        faArrowAltCircleLeft,
        faArrowAltCircleRight,
        faCheckSquare,
        faEyeSlash,
        faCircleQuestion,
        faPenToSquare,
        faComments,
        faFlag,
        faRectangleList
    );
  }
}
