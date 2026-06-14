import { ApiError } from "../errors/api-error.js";
import { Question, QuestionOption, Quiz } from "../database/models.js";
import { sequelize } from "../database/sequelize.js";
import type { CreateQuizInput } from "./quiz.schema.js";

export async function createQuiz(input: CreateQuizInput) {
  const quizId = await sequelize.transaction(async (transaction) => {
    const quiz = await Quiz.create({ title: input.title }, { transaction });

    for (const [position, question] of input.questions.entries()) {
      const createdQuestion = await Question.create(
        {
          text: question.text,
          type: question.type,
          position,
          booleanAnswer: question.type === "BOOLEAN" ? question.answer : null,
          textAnswer: question.type === "INPUT" ? question.answer : null,
          quizId: quiz.id,
        },
        { transaction },
      );

      if (question.type === "CHECKBOX") {
        await QuestionOption.bulkCreate(
          question.options.map((option, optionPosition) => ({
            text: option,
            position: optionPosition,
            isCorrect: question.correctAnswers.includes(option),
            questionId: createdQuestion.id,
          })),
          { transaction },
        );
      }
    }

    return quiz.id;
  });

  return getQuiz(quizId);
}

export async function getQuizzes() {
  const quizzes = await Quiz.findAll({
    order: [["createdAt", "DESC"]],
    include: {
      model: Question,
      as: "questions",
      attributes: ["id"],
    },
  });

  return quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    questionCount: quiz.questions?.length ?? 0,
    createdAt: quiz.createdAt.toISOString(),
  }));
}

export async function getQuiz(id: string) {
  const quiz = await Quiz.findByPk(id);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  const questions = await Question.findAll({
    where: { quizId: id },
    order: [["position", "ASC"]],
    include: {
      model: QuestionOption,
      as: "options",
    },
  });

  return serializeQuiz(quiz, questions);
}

export async function deleteQuiz(id: string) {
  const deletedCount = await Quiz.destroy({ where: { id } });

  if (deletedCount === 0) {
    throw new ApiError(404, "Quiz not found.");
  }
}

function serializeQuiz(quiz: Quiz, questions: Question[]) {
  return {
    id: quiz.id,
    title: quiz.title,
    createdAt: quiz.createdAt.toISOString(),
    questions: questions.map((question) => {
      const baseQuestion = {
        id: question.id,
        text: question.text,
      };

      if (question.type === "BOOLEAN") {
        return {
          ...baseQuestion,
          type: "BOOLEAN" as const,
          answer: question.booleanAnswer ?? false,
        };
      }

      if (question.type === "INPUT") {
        return {
          ...baseQuestion,
          type: "INPUT" as const,
          answer: question.textAnswer ?? "",
        };
      }

      return {
        ...baseQuestion,
        type: "CHECKBOX" as const,
        options: sortOptions(question.options).map((option) => option.text),
        correctAnswers: sortOptions(question.options)
          .filter((option) => option.isCorrect)
          .map((option) => option.text),
      };
    }),
  };
}

function sortOptions(options: QuestionOption[] | undefined) {
  return [...(options ?? [])].sort(
    (firstOption, secondOption) => firstOption.position - secondOption.position,
  );
}
