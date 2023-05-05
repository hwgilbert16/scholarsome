import { Component, Input, OnInit } from "@angular/core";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { QuizQuestion } from "@scholarsome/shared";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "scholarsome-study-set-quiz-question",
  templateUrl: "./study-set-quiz-question.component.html",
  styleUrls: ["./study-set-quiz-question.component.scss"]
})
export class StudySetQuizQuestionComponent implements OnInit {
  @Input() question: QuizQuestion;
  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;
  @Input() correct: boolean;

  faArrowRight = faArrowRight;
  selectedIndex = -1;
  correctIndex?: number;

  ngOnInit(): void {
    if (this.question.options) {
      this.correctIndex = this.question.options.findIndex((q) => q.correct);
    }
  }
}
