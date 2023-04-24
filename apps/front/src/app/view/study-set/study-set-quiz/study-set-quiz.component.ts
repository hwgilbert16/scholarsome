import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { NgForm } from "@angular/forms";
import { SetsService } from "../../../shared/http/sets.service";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizQuestion, Set } from "@scholarsome/shared";
import { StudySetQuizQuestionComponent } from "./study-set-quiz-question/study-set-quiz-question.component";

@Component({
  selector: "scholarsome-study-set-quiz",
  templateUrl: "./study-set-quiz.component.html",
  styleUrls: ["./study-set-quiz.component.scss"]
})
export class StudySetQuizComponent implements OnInit {
  constructor(
    private sets: SetsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChild("quiz", { static: true, read: ViewContainerRef }) quiz: ViewContainerRef;

  writtenSelected = true;
  trueOrFalseSelected = true;
  multipleChoiceSelected = true;

  created = false;

  set: Set;

  beginQuiz(form: NgForm) {
    this.created = true;

    const questions: QuizQuestion[] = [];
    let unusedIndices = Array.from(Array(this.set.cards.length).keys());

    const answerWith = form.controls["answerWith"].value;

    let questionTypes: { type: string; enabled: boolean }[] = [
      { type: "written", enabled: form.controls["written"].value },
      { type: "trueOrFalse", enabled: form.controls["trueOrFalse"].value },
      { type: "multipleChoice", enabled: form.controls["multipleChoice"].value }
    ];

    // ensures that multiple choice does not always have the least number of questions
    questionTypes = questionTypes.sort(() => 0.5 - Math.random());

    const typePercentage = 1 / questionTypes.filter((t) => t.enabled).length;
    let generatedQuestions = 0;

    for (const questionType of questionTypes) {
      let numQuestions = 0;

      if (questionTypes[questionTypes.length - 1].type === questionType.type) {
        // change this to questions.length when done
        numQuestions = form.controls["numberOfQuestions"].value - generatedQuestions;
      } else {
        numQuestions = Math.ceil(form.controls["numberOfQuestions"].value * typePercentage);
      }

      // remove this when done
      generatedQuestions += numQuestions;

      // although this is not a perfectly random sort, we do not need perfect randomness here
      const indices = [...unusedIndices].sort(() => 0.5 - Math.random()).splice(0, numQuestions);

      for (const index of indices) {
        unusedIndices = unusedIndices.filter((i) => i !== index);

        // must be assigned here to suppress a ts error in the second switch
        let questionAnswerWith: "term" | "definition" = "term";
        let questionAskWith: "term" | "definition" = "term";

        switch (answerWith) {
          case "both":
            // random int between 1 and 2
            if (Math.floor(Math.random() * 2) + 1 === 1) {
              questionAnswerWith = "term";
              questionAskWith = "definition";
            } else {
              questionAnswerWith = "definition";
              questionAskWith = "term";
            }
            break;
          case "term":
            questionAnswerWith = "term";
            questionAskWith = "definition";
            break;
          case "definition":
            questionAnswerWith = "definition";
            questionAskWith = "term";
            break;
        }

        if (questionType.type === "written") {
          questions.push({
            question: this.set.cards[index][questionAskWith],
            number: questions.length + 1,
            answerWith: questionAnswerWith,
            type: "written",
            answer: this.set.cards[index][questionAnswerWith]
          });
        } else if (questionType.type === "trueOrFalse") {
          const answer = Math.floor(Math.random() * 2) + 1 === 1 ? "True" : "False";

          let options: { option: string; correct: boolean; }[] = [
            {
              option: answer,
              correct: true
            },
            {
              option: answer === "True" ? "False" : "True",
              correct: false
            }
          ];

          options = options.sort(() => 0.5 - Math.random());

          questions.push({
            question: this.set.cards[index][questionAskWith],
            number: questions.length + 1,
            answerWith: questionAnswerWith,
            // this might need a +1, need to check
            trueOrFalseOption: this.set.cards[Math.floor(Math.random() * this.set.cards.length)][questionAnswerWith],
            type: "trueOrFalse",
            options,
            answer
          });
        } else {
          let options: { option: string; correct: boolean; }[] = [
            {
              option: this.set.cards[index][questionAnswerWith],
              correct: true
            }
          ];
          let questionIndices = Array.from(Array(this.set.cards.length).keys()).sort(() => 0.5 - Math.random());
          questionIndices = questionIndices.splice(0, 3);

          for (let i = 0; i < questionIndices.length; i++) {
            options.push({
              option: this.set.cards[questionIndices[i]][questionAnswerWith],
              correct: false
            });
          }

          options = options.sort(() => 0.5 - Math.random());

          questions.push({
            question: this.set.cards[index][questionAskWith],
            number: questions.length + 1,
            answerWith: questionAnswerWith,
            type: "multipleChoice",
            answer: this.set.cards[index][questionAnswerWith],
            options
          });
        }
      }
    }

    for (const question of questions) {
      const qComponent = this.quiz.createComponent<StudySetQuizQuestionComponent>(StudySetQuizQuestionComponent);

      qComponent.instance.question = question.question;
      qComponent.instance.questionType = question.type;
      qComponent.instance.questionNumber = question.number;
      qComponent.instance.termOrDefinition = question.answerWith;
      qComponent.instance.questionOptions = question.options ? question.options : null;
    }
  }

  async ngOnInit(): Promise<void> {
    const set = await this.sets.set(
        this.route.snapshot.paramMap.get("setId")
    );

    if (!set) {
      await this.router.navigate(["404"]);
      return;
    }

    this.set = set;
  }
}
