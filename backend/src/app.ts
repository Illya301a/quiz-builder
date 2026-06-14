import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { quizRouter } from "./quizzes/quiz.routes.js";

export const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json({ limit: "100kb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/quizzes", quizRouter);
app.use(notFoundHandler);
app.use(errorHandler);
