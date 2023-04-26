import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuardService } from "../auth/auth-guard.service";
import { HomepageComponent } from "../homepage/homepage.component";
import { StudySetFlashcardsComponent } from "./study-set-flashcards/study-set-flashcards.component";
import { StudySetQuizComponent } from "./study-set-quiz/study-set-quiz.component";
import { StudySetComponent } from "./study-set.component";

const routes: Routes = [
  {
    path: "",
    component: HomepageComponent,
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
