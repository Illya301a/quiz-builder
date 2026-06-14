import type { CreateQuizPayload, Quiz, QuizSummary } from "@/types/quiz";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? "The request could not be completed.";
  } catch {
    return "The request could not be completed.";
  }
}

export function getQuizzes() {
  return request<QuizSummary[]>("/quizzes");
}

export function getQuiz(id: string) {
  return request<Quiz>(`/quizzes/${id}`);
}

export function createQuiz(payload: CreateQuizPayload) {
  return request<Quiz>("/quizzes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteQuiz(id: string) {
  return request<void>(`/quizzes/${id}`, {
    method: "DELETE",
  });
}
