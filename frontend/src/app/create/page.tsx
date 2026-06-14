import { QuizForm } from "@/components/quiz-form";

export default function CreateQuizPage() {
  return (
    <main>
      <div className="page-heading">
        <div>
          <h1>Create a quiz</h1>
          <p>
            Add a title and build the quiz with true or false, short answer, and
            multiple choice questions.
          </p>
        </div>
      </div>

      <QuizForm />
    </main>
  );
}
