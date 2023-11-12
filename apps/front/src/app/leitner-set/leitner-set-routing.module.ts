import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { LeitnerSetStudySessionComponent } from "./leitner-set-study-session/leitner-set-study-session.component";

const routes: Routes = [
  {
    path: "study-session/:setId",
    component: LeitnerSetStudySessionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeitnerSetRoutingModule {}
