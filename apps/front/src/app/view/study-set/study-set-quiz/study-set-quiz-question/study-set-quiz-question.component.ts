import { Component, Input } from "@angular/core";

@Component({
  selector: "scholarsome-study-set-quiz-question",
  templateUrl: "./study-set-quiz-question.component.html",
  styleUrls: ["./study-set-quiz-question.component.scss"]
})
export class StudySetQuizQuestionComponent {
  @Input() question: string;
  @Input() questionType: "written" | "trueOrFalse" | "multipleChoice";
  @Input() questionNumber: number;
  @Input() termOrDefinition: string;
  @Input() questionOptions?: { option: string; correct: boolean; }[] | null;
}
