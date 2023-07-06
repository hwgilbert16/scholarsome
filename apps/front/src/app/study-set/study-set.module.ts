import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StudySetComponent } from "./study-set.component";
import { StudySetFlashcardsComponent } from "./study-set-flashcards/study-set-flashcards.component";
import { StudySetQuizComponent } from "./study-set-quiz/study-set-quiz.component";
import {
  StudySetQuizQuestionComponent
} from "./study-set-quiz/study-set-quiz-question/study-set-quiz-question.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StudySetRoutingModule } from "./study-set-routing.module";

@NgModule({
  declarations: [
    StudySetComponent,
    StudySetFlashcardsComponent,
    StudySetQuizComponent,
    StudySetQuizQuestionComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    StudySetRoutingModule,
    FontAwesomeModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StudySetModule {}
