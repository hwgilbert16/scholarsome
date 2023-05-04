export interface QuizQuestion {
  question: string;
  index: number;
  answerWith: string;
  trueOrFalseOption?: string;
  type: "written" | "trueOrFalse" | "multipleChoice";
  options?: string[];
  answer: string;
  correct: boolean;
}
