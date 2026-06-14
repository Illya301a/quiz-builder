import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { Question, QuestionOption, Quiz } from "../src/database/models.js";
import { sequelize } from "../src/database/sequelize.js";

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
  await rm(resolve(process.cwd(), "data/test.db"), { force: true });
});

describe("quiz API", () => {
  it("creates and returns a quiz with every question type", async () => {
    const createResponse = await request(app)
      .post("/quizzes")
      .send({
        title: "JavaScript basics",
        questions: [
          {
            type: "BOOLEAN",
            text: "JavaScript runs in a browser.",
            answer: true,
          },
          {
            type: "INPUT",
            text: "Which keyword declares a constant?",
            answer: "const",
          },
          {
            type: "CHECKBOX",
            text: "Select primitive values.",
            options: ["string", "number", "object"],
            correctAnswers: ["string", "number"],
          },
        ],
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toMatchObject({
      title: "JavaScript basics",
      questions: [
        {
          type: "BOOLEAN",
          answer: true,
        },
        {
          type: "INPUT",
          answer: "const",
        },
        {
          type: "CHECKBOX",
          options: ["string", "number", "object"],
          correctAnswers: ["string", "number"],
        },
      ],
    });

    const detailsResponse = await request(app).get(
      `/quizzes/${createResponse.body.id}`,
    );

    expect(detailsResponse.status).toBe(200);
    expect(detailsResponse.body).toEqual(createResponse.body);
  });

  it("lists quizzes with their question counts", async () => {
    await createBooleanQuiz("First quiz");
    await createBooleanQuiz("Second quiz");

    const response = await request(app).get("/quizzes");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "First quiz",
          questionCount: 1,
        }),
        expect.objectContaining({
          title: "Second quiz",
          questionCount: 1,
        }),
      ]),
    );
  });

  it("deletes a quiz and its related questions", async () => {
    const createResponse = await createBooleanQuiz("Temporary quiz");

    const deleteResponse = await request(app).delete(
      `/quizzes/${createResponse.body.id}`,
    );

    expect(deleteResponse.status).toBe(204);
    expect(await Quiz.count()).toBe(0);
    expect(await Question.count()).toBe(0);
    expect(await QuestionOption.count()).toBe(0);
  });

  it("rejects an invalid checkbox question", async () => {
    const response = await request(app)
      .post("/quizzes")
      .send({
        title: "Invalid quiz",
        questions: [
          {
            type: "CHECKBOX",
            text: "Choose an answer.",
            options: ["One", "Two"],
            correctAnswers: ["Three"],
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed.");
  });

  it("returns 404 for an unknown quiz", async () => {
    const response = await request(app).get("/quizzes/missing-id");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Quiz not found." });
  });
});

function createBooleanQuiz(title: string) {
  return request(app)
    .post("/quizzes")
    .send({
      title,
      questions: [
        {
          type: "BOOLEAN",
          text: "Example question",
          answer: true,
        },
      ],
    });
}
