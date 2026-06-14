import { z } from "zod";

const questionText = z.string().trim().min(1).max(500);
const answerText = z.string().trim().min(1).max(300);

const booleanQuestionSchema = z.object({
  type: z.literal("BOOLEAN"),
  text: questionText,
  answer: z.boolean(),
});

const inputQuestionSchema = z.object({
  type: z.literal("INPUT"),
  text: questionText,
  answer: answerText,
});

const checkboxQuestionSchema = z
  .object({
    type: z.literal("CHECKBOX"),
    text: questionText,
    options: z.array(answerText).min(2).max(20),
    correctAnswers: z.array(answerText).min(1),
  })
  .superRefine((question, context) => {
    const uniqueOptions = new Set(question.options);
    const uniqueCorrectAnswers = new Set(question.correctAnswers);

    if (uniqueOptions.size !== question.options.length) {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Answer options must be unique.",
      });
    }

    if (uniqueCorrectAnswers.size !== question.correctAnswers.length) {
      context.addIssue({
        code: "custom",
        path: ["correctAnswers"],
        message: "Correct answers must be unique.",
      });
    }

    for (const correctAnswer of uniqueCorrectAnswers) {
      if (!uniqueOptions.has(correctAnswer)) {
        context.addIssue({
          code: "custom",
          path: ["correctAnswers"],
          message: "Every correct answer must match an answer option.",
        });
        break;
      }
    }
  });

export const createQuizSchema = z.object({
  title: z.string().trim().min(1).max(150),
  questions: z
    .array(
      z.discriminatedUnion("type", [
        booleanQuestionSchema,
        inputQuestionSchema,
        checkboxQuestionSchema,
      ]),
    )
    .min(1)
    .max(100),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
