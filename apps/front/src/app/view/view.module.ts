import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ViewComponent } from "./view.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ViewRoutingModule } from "./view-routing.module";
import { ViewStudySetsComponent } from "./study-set/view-study-sets.component";
import { StudySetDescriptionComponent } from "./study-set-description/study-set-description.component";
import { PopoverModule } from "ngx-bootstrap/popover";
import { StudySetCardComponent } from "./study-set/study-set-card/study-set-card.component";
import { StudySetFlashcardsComponent } from "./study-set/study-set-flashcards/study-set-flashcards.component";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { StudySetQuizComponent } from "./study-set/study-set-quiz/study-set-quiz.component";
import { FormsModule } from "@angular/forms";
import { StudySetQuizQuestionComponent } from "./study-set/study-set-quiz/study-set-quiz-question/study-set-quiz-question.component";

@NgModule({
  declarations: [
    ViewStudySetsComponent,
    ViewComponent,
    StudySetDescriptionComponent,
    StudySetCardComponent,
    StudySetFlashcardsComponent,
    StudySetQuizComponent,
    StudySetQuizQuestionComponent
  ],
  exports: [StudySetCardComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ViewRoutingModule,
    PopoverModule,
    TooltipModule,
    FormsModule
  ]
})
export class ViewModule {}
