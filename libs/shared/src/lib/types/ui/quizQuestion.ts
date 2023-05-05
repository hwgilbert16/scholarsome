export interface QuizQuestion {
  question: string;
  index: number;
  answerWith: string;
  trueOrFalseOption?: string;
  type: "written" | "trueOrFalse" | "multipleChoice";
  options?: {
    option: string;
    correct: boolean;
  }[];
  answer: string;
  correct: boolean;
}
