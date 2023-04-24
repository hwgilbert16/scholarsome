import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ViewComponent } from "./view.component";
import { AuthGuardService } from "../auth/auth-guard.service";
import { ViewStudySetsComponent } from "./study-set/view-study-sets.component";
import { StudySetFlashcardsComponent } from "./study-set/study-set-flashcards/study-set-flashcards.component";
import { StudySetQuizComponent } from "./study-set/study-set-quiz/study-set-quiz.component";

const routes: Routes = [
  {
    path: "",
    component: ViewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "sets/:setId",
    component: ViewStudySetsComponent
  },
  {
    path: "sets/:setId/flashcards",
    component: StudySetFlashcardsComponent
  },
  {
    path: "sets/:setId/quiz",
    component: StudySetQuizComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule {}
