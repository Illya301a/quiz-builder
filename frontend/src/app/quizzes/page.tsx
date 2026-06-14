"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DeleteIcon } from "@/components/delete-icon";
import { deleteQuiz, getQuizzes } from "@/lib/api";
import type { QuizSummary } from "@/types/quiz";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getQuizzes()
      .then((loadedQuizzes) => {
        if (isCurrent) {
          setQuizzes(loadedQuizzes);
        }
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Quizzes could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  async function handleDelete(quiz: QuizSummary) {
    const shouldDelete = window.confirm(
      `Delete "${quiz.title}"? This action cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingId(quiz.id);
    setError("");

    try {
      await deleteQuiz(quiz.id);
      setQuizzes((currentQuizzes) =>
        currentQuizzes.filter((item) => item.id !== quiz.id),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "The quiz could not be deleted.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main>
      <div className="page-heading">
        <div>
          <h1>Your quizzes</h1>
          <p>Review existing quizzes or create a new one from scratch.</p>
        </div>
        <Link className="button button--primary" href="/create">
          Create quiz
        </Link>
      </div>

      {error && (
        <div className="alert" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="card status-state">
          <h2>Loading quizzes</h2>
          <p>Please wait while the quiz list is being loaded.</p>
        </div>
      ) : quizzes.length === 0 && !error ? (
        <div className="card empty-state">
          <h2>No quizzes yet</h2>
          <p>Create your first quiz to see it listed here.</p>
          <Link className="button button--primary" href="/create">
            Create first quiz
          </Link>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <article className="card quiz-card" key={quiz.id}>
              <Link className="quiz-card__link" href={`/quizzes/${quiz.id}`}>
                <h2>{quiz.title}</h2>
                <p>
                  {quiz.questionCount}{" "}
                  {quiz.questionCount === 1 ? "question" : "questions"}
                </p>
              </Link>
              <button
                className="icon-button"
                type="button"
                aria-label={`Delete ${quiz.title}`}
                title="Delete quiz"
                disabled={deletingId === quiz.id}
                onClick={() => void handleDelete(quiz)}
              >
                <DeleteIcon />
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
