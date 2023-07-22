import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StudySetComponent } from "./study-set.component";
import { StudySetFlashcardsComponent } from "./study-set-flashcards/study-set-flashcards.component";
import { StudySetQuizComponent } from "./study-set-quiz/study-set-quiz.component";
import {
  StudySetQuizQuestionComponent
} from "./study-set-quiz/study-set-quiz-question/study-set-quiz-question.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StudySetRoutingModule } from "./study-set-routing.module";

@NgModule({
  imports: [
    CommonModule,
    StudySetRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  declarations: [
    StudySetComponent,
    StudySetFlashcardsComponent,
    StudySetQuizComponent,
    StudySetQuizQuestionComponent
  ],
  exports: []
})
export class StudySetModule {}
