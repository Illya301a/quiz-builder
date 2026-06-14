import { Router } from "express";
import { createQuizSchema } from "./quiz.schema.js";
import { createQuiz, deleteQuiz, getQuiz, getQuizzes } from "./quiz.service.js";

export const quizRouter = Router();

quizRouter.post("/", async (request, response) => {
  const input = createQuizSchema.parse(request.body);
  const quiz = await createQuiz(input);

  response.status(201).json(quiz);
});

quizRouter.get("/", async (_request, response) => {
  response.json(await getQuizzes());
});

quizRouter.get("/:id", async (request, response) => {
  response.json(await getQuiz(request.params.id));
});

quizRouter.delete("/:id", async (request, response) => {
  await deleteQuiz(request.params.id);
  response.status(204).send();
});
