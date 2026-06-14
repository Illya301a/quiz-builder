import type { Question } from "@/types/quiz";

const typeLabels: Record<Question["type"], string> = {
  BOOLEAN: "True / False",
  INPUT: "Short answer",
  CHECKBOX: "Multiple choice",
};

interface QuestionDetailProps {
  question: Question;
}

export function QuestionDetail({ question }: QuestionDetailProps) {
  return (
    <article className="card question-detail">
      <div className="question-detail__heading">
        <h2>{question.text}</h2>
        <span className="question-type">{typeLabels[question.type]}</span>
      </div>

      {question.type === "BOOLEAN" && (
        <p className="answer">
          Correct answer: {question.answer ? "True" : "False"}
        </p>
      )}

      {question.type === "INPUT" && (
        <p className="answer">Correct answer: {question.answer}</p>
      )}

      {question.type === "CHECKBOX" && (
        <ul className="answer-options">
          {question.options.map((option) => (
            <li
              key={option}
              data-correct={question.correctAnswers.includes(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
