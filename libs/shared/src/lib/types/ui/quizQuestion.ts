export interface QuizQuestion {
  question: string;
  number: number;
  answerWith: string;
  trueOrFalseOption?: string;
  type: "written" | "trueOrFalse" | "multipleChoice";
  options?: {
    option: string;
    correct: boolean;
  }[];
  answer: string;
}
