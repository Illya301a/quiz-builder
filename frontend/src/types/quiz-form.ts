import type { QuestionType } from "@/types/quiz";

export interface OptionDraft {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionDraft {
  id: string;
  text: string;
  type: QuestionType;
  answer: string | boolean;
  options: OptionDraft[];
}

function createOption(id = crypto.randomUUID()): OptionDraft {
  return {
    id,
    text: "",
    isCorrect: false,
  };
}

export function createQuestion(id = crypto.randomUUID()): QuestionDraft {
  return {
    id,
    text: "",
    type: "BOOLEAN",
    answer: true,
    options: [createOption(`${id}-option-1`), createOption(`${id}-option-2`)],
  };
}

export function createQuestionOption() {
  return createOption();
}
