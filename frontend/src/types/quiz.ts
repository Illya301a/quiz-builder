export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

interface BaseQuestion {
  id: string;
  text: string;
}

export interface BooleanQuestion extends BaseQuestion {
  type: "BOOLEAN";
  answer: boolean;
}

export interface InputQuestion extends BaseQuestion {
  type: "INPUT";
  answer: string;
}

export interface CheckboxQuestion extends BaseQuestion {
  type: "CHECKBOX";
  options: string[];
  correctAnswers: string[];
}

export type Question = BooleanQuestion | InputQuestion | CheckboxQuestion;

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
}

export interface QuizSummary {
  id: string;
  title: string;
  questionCount: number;
  createdAt: string;
}

type QuestionWithoutId =
  | Omit<BooleanQuestion, "id">
  | Omit<InputQuestion, "id">
  | Omit<CheckboxQuestion, "id">;

export interface CreateQuizPayload {
  title: string;
  questions: QuestionWithoutId[];
}
