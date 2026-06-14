import { setupDatabase } from "./setup.js";
import { Quiz } from "./models.js";
import { sequelize } from "./sequelize.js";
import { createQuiz } from "../quizzes/quiz.service.js";

async function seed() {
  await setupDatabase();

  if ((await Quiz.count()) > 0) {
    console.log("Seed skipped because quizzes already exist.");
    return;
  }

  await createQuiz({
    title: "JavaScript fundamentals",
    questions: [
      {
        type: "BOOLEAN",
        text: "JavaScript can run outside a browser.",
        answer: true,
      },
      {
        type: "INPUT",
        text: "Which keyword declares a constant?",
        answer: "const",
      },
      {
        type: "CHECKBOX",
        text: "Select JavaScript primitive types.",
        options: ["string", "number", "object"],
        correctAnswers: ["string", "number"],
      },
    ],
  });

  console.log("Sample quiz created.");
}

seed()
  .catch((error: unknown) => {
    console.error("Database seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
