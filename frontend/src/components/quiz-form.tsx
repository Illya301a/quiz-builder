"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionEditor } from "@/components/question-editor";
import { createQuiz } from "@/lib/api";
import { createQuestion, type QuestionDraft } from "@/types/quiz-form";
import type { CreateQuizPayload } from "@/types/quiz";

export function QuizForm() {
  const router = useRouter();
  const initialQuestionId = useId();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    createQuestion(initialQuestionId),
  ]);
  const [titleError, setTitleError] = useState("");
  const [questionErrors, setQuestionErrors] = useState<Record<string, string>>(
    {},
  );
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateQuestion(updatedQuestion: QuestionDraft) {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === updatedQuestion.id ? updatedQuestion : question,
      ),
    );
  }

  function removeQuestion(questionId: string) {
    setQuestions((currentQuestions) =>
      currentQuestions.filter((question) => question.id !== questionId),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const errors = validateQuestions(questions);
    const nextTitleError = title.trim() ? "" : "Quiz title is required.";

    setTitleError(nextTitleError);
    setQuestionErrors(errors);

    if (nextTitleError || Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const quiz = await createQuiz(buildPayload(title, questions));
      router.push(`/quizzes/${quiz.id}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "The quiz could not be created.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      {submitError && (
        <div className="alert" role="alert">
          {submitError}
        </div>
      )}

      <div className="field">
        <label htmlFor="quiz-title">Quiz title</label>
        <input
          id="quiz-title"
          value={title}
          placeholder="For example: JavaScript fundamentals"
          onChange={(event) => setTitle(event.target.value)}
        />
        {titleError && <p className="field-error">{titleError}</p>}
      </div>

      <div className="question-list">
        {questions.map((question, index) => (
          <QuestionEditor
            key={question.id}
            index={index}
            question={question}
            error={questionErrors[question.id]}
            canRemove={questions.length > 1}
            onChange={updateQuestion}
            onRemove={() => removeQuestion(question.id)}
          />
        ))}
      </div>

      <div className="form-actions">
        <button
          className="button button--secondary"
          type="button"
          onClick={() =>
            setQuestions((currentQuestions) => [
              ...currentQuestions,
              createQuestion(),
            ])
          }
        >
          Add question
        </button>
        <button
          className="button button--primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create quiz"}
        </button>
      </div>
    </form>
  );
}

function validateQuestions(questions: QuestionDraft[]) {
  return questions.reduce<Record<string, string>>((errors, question) => {
    if (!question.text.trim()) {
      errors[question.id] = "Question text is required.";
      return errors;
    }

    if (question.type === "INPUT" && !String(question.answer).trim()) {
      errors[question.id] = "A correct answer is required.";
      return errors;
    }

    if (question.type === "CHECKBOX") {
      const options = question.options.map((option) => option.text.trim());

      if (options.some((option) => !option)) {
        errors[question.id] = "All answer options must have text.";
      } else if (new Set(options).size !== options.length) {
        errors[question.id] = "Answer options must be unique.";
      } else if (!question.options.some((option) => option.isCorrect)) {
        errors[question.id] = "Select at least one correct answer.";
      }
    }

    return errors;
  }, {});
}

function buildPayload(
  title: string,
  questions: QuestionDraft[],
): CreateQuizPayload {
  return {
    title: title.trim(),
    questions: questions.map((question) => {
      const text = question.text.trim();

      if (question.type === "BOOLEAN") {
        return {
          text,
          type: "BOOLEAN",
          answer: Boolean(question.answer),
        };
      }

      if (question.type === "INPUT") {
        return {
          text,
          type: "INPUT",
          answer: String(question.answer).trim(),
        };
      }

      const options = question.options.map((option) => option.text.trim());

      return {
        text,
        type: "CHECKBOX",
        options,
        correctAnswers: question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.text.trim()),
      };
    }),
  };
}
