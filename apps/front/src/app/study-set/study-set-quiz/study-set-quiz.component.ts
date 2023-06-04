import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { SetsService } from "../../shared/http/sets.service";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizQuestion, Set } from "@scholarsome/shared";
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: "scholarsome-study-set-quiz",
  templateUrl: "./study-set-quiz.component.html",
  styleUrls: ["./study-set-quiz.component.scss"]
})
export class StudySetQuizComponent implements OnInit {
  constructor(
    private readonly sets: SetsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {}

  @ViewChild("quiz", { static: false, read: ViewContainerRef }) quiz: ViewContainerRef;

  writtenSelected = true;
  trueOrFalseSelected = true;
  multipleChoiceSelected = true;

  created = false;
  submitted = false;

  quizForm: FormGroup;

  setId: string | null;
  set: Set;
  questions: QuizQuestion[];

  percentCorrect: number;

  beginQuiz(form: NgForm) {
    this.quizForm = new FormGroup({});

    const questions: QuizQuestion[] = [];
    this.questions = questions;

    if (form.controls["numberOfQuestions"].value > this.set.cards.length) {
      const existingCards = this.set.cards;

      for (let i = 0; i < Math.ceil(form.controls["numberOfQuestions"].value / this.set.cards.length); i++) {
        this.set.cards.push(...existingCards);
      }
    }

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

    this.created = true;

    for (const questionType of questionTypes) {
      if (!questionType.enabled) continue;

      let numQuestions = 0;

      if (questionTypes[questionTypes.length - 1].type === questionType.type) {
        // change this to questions.length when done
        numQuestions = form.controls["numberOfQuestions"].value - generatedQuestions;
      } else {
        numQuestions = Math.floor(form.controls["numberOfQuestions"].value * typePercentage);
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
            index: 0,
            answerWith: questionAnswerWith,
            type: "written",
            answer: this.set.cards[index][questionAnswerWith],
            correct: false
          });
        } else if (questionType.type === "trueOrFalse") {
          // 30% chance that the answer is true
          const trueResult = Math.random() >= 0.7;

          let trueOrFalseOption = "";

          if (trueResult) {
            trueOrFalseOption = this.set.cards[index][questionAnswerWith];
          } else {
            do {
              trueOrFalseOption = this.set.cards[Math.floor(Math.random() * this.set.cards.length)][questionAnswerWith];
            } while (trueOrFalseOption === this.set.cards[index][questionAnswerWith]);
          }

          questions.push({
            question: this.set.cards[index][questionAskWith],
            index: 0,
            answerWith: questionAnswerWith,
            trueOrFalseOption,
            type: "trueOrFalse",
            options: [
              {
                option: "True",
                correct: trueResult
              }, {
                option: "False",
                correct: !trueResult
              }
            ],
            answer: trueResult ? "True" : "False",
            correct: false
          });
        } else {
          let options = [
            {
              option: this.set.cards[index][questionAnswerWith],
              correct: true
            }
          ];

          for (let i = 0; i < 3; i++) {
            let option: { option: string; correct: boolean; };

            do {
              option = {
                option: this.set.cards[Math.floor(Math.random() * this.set.cards.length)][questionAnswerWith],
                correct: false
              };
            } while (options.filter((o) => o.option === option.option).length > 0);

            options.push(option);
          }

          options = options.sort(() => 0.5 - Math.random());

          questions.push({
            question: this.set.cards[index][questionAskWith],
            index: 0,
            answerWith: questionAnswerWith,
            type: "multipleChoice",
            answer: this.set.cards[index][questionAnswerWith],
            options,
            correct: false
          });
        }
      }
    }

    questions.sort(() => 0.5 - Math.random());
    questions.map((q, index) => {
      q.index = index;

      this.quizForm.addControl("q" + index, this.fb.group({
        [q.type]: "",
        index: q.index
      }));
    });
  }

  submitQuiz(form: FormGroup, questions: QuizQuestion[]) {
    this.submitted = true;
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
    form.disable();

    let count = 0;

    for (const question of Object.values(form.controls)) {
      const response = Object.values(question.value)[0] as string;

      switch (Object.keys(question.value)[0]) {
        case "written":
          if (
            response.toLowerCase() ===
            questions[question.value["index"]].answer.toLowerCase()
          ) count++;
          questions[question.value["index"]].correct = response.toLowerCase() === questions[question.value["index"]].answer.toLowerCase();

          break;
        case "trueOrFalse":
          if (question.value["trueOrFalse"].length < 1) break;

          if (
            questions[question.value["index"]].answer ===
            questions[question.value["index"]].options?.[question.value["trueOrFalse"] as number].option
          ) {
            questions[question.value["index"]].correct = true;
            count++;
          }

          break;
        case "multipleChoice":
          if (question.value["multipleChoice"].length < 1) break;

          if (
            questions[question.value["index"]].answer ===
            questions[question.value["index"]].options?.[question.value["multipleChoice"] as number].option
          ) {
            questions[question.value["index"]].correct = true;
            count++;
          }
      }
    }

    this.percentCorrect = Math.floor(100 / questions.length * count);
  }

  reloadPage() {
    window.location.reload();
  }

  async ngOnInit(): Promise<void> {
    this.percentCorrect = -1;
    this.setId = this.route.snapshot.paramMap.get("setId");

    const set = await this.sets.set(this.setId);

    if (!set) {
      await this.router.navigate(["404"]);
      return;
    }

    this.titleService.setTitle(set.title + " — Scholarsome");
    this.metaService.addTag({ name: "description", content: "Start a quiz for the " + set.title + " study set on Scholarsome. Improve your memorization skills by taking a quiz." });

    if (set.cards.length < 4) {
      this.multipleChoiceSelected = false;
    }

    this.set = set;
  }
}
