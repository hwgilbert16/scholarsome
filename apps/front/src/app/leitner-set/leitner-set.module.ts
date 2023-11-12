import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LeitnerSetRoutingModule } from "./leitner-set-routing.module";
import { LeitnerSetStudySessionComponent } from "./leitner-set-study-session/leitner-set-study-session.component";
import { SharedModule } from "../shared/shared.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  imports: [
    CommonModule,
    LeitnerSetRoutingModule,
    SharedModule,
    FontAwesomeModule
  ],
  declarations: [LeitnerSetStudySessionComponent]
})
export class LeitnerSetModule {}
