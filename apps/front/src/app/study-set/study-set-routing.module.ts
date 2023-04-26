import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuardService } from "../auth/auth-guard.service";
import { ViewComponent } from "../view/view.component";
import { StudySetFlashcardsComponent } from "./study-set-flashcards/study-set-flashcards.component";
import { StudySetQuizComponent } from "./study-set-quiz/study-set-quiz.component";
import { StudySetComponent } from "./study-set.component";

const routes: Routes = [
  {
    path: "",
    component: ViewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: ":setId",
    component: StudySetComponent
  },
  {
    path: ":setId/flashcards",
    component: StudySetFlashcardsComponent
  },
  {
    path: ":setId/quiz",
    component: StudySetQuizComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudySetRoutingModule {}
