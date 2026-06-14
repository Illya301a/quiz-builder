"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QuestionDetail } from "@/components/question-detail";
import { getQuiz } from "@/lib/api";
import type { Quiz } from "@/types/quiz";

export default function QuizDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    getQuiz(id)
      .then((loadedQuiz) => {
        if (isCurrent) {
          setQuiz(loadedQuiz);
        }
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The quiz could not be loaded.",
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
  }, [id]);

  if (isLoading) {
    return (
      <main>
        <div className="card status-state">
          <h2>Loading quiz</h2>
          <p>Please wait while the quiz details are being loaded.</p>
        </div>
      </main>
    );
  }

  if (!quiz || error) {
    return (
      <main>
        <div className="card status-state">
          <h2>Quiz unavailable</h2>
          <p>{error || "The requested quiz was not found."}</p>
          <Link className="button button--secondary" href="/quizzes">
            Back to quizzes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="page-heading">
        <div>
          <h1>{quiz.title}</h1>
          <p>
            {quiz.questions.length}{" "}
            {quiz.questions.length === 1 ? "question" : "questions"}
          </p>
        </div>
        <Link className="button button--secondary" href="/quizzes">
          Back to quizzes
        </Link>
      </div>

      <div className="detail-list">
        {quiz.questions.map((question) => (
          <QuestionDetail key={question.id} question={question} />
        ))}
      </div>
    </main>
  );
}
