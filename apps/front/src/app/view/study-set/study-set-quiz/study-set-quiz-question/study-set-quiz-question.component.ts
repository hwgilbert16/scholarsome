import { Component, Input } from "@angular/core";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { QuizQuestion } from "@scholarsome/shared";

@Component({
  selector: "scholarsome-study-set-quiz-question",
  templateUrl: "./study-set-quiz-question.component.html",
  styleUrls: ["./study-set-quiz-question.component.scss"]
})
export class StudySetQuizQuestionComponent {
  @Input() question: QuizQuestion;

  faArrowRight = faArrowRight;
  tfOption2: string;

  constructor() {
    if (
      this.question &&
      this.question.options &&
      this.question.options.length === 2
    ) {
      console.log(this.tfOption2);
      this.tfOption2 = this.question.options[1].option;
    }
  }

  protected readonly webkitURL = webkitURL;
}
