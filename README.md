# Quiz Builder

Full-stack application for creating and viewing custom quizzes.

## Tech Stack

- Frontend: Next.js, React, TypeScript
- Backend: Express, TypeScript, Sequelize
- Database: SQLite
- Validation: Zod
- Tests: Vitest and Supertest

## Project Structure

```text
quiz-builder/
├── backend/
├── frontend/
└── README.md
```

## Local Setup

### 1. Start the backend

Open the first terminal:

```bash
cd backend
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

The API will be available at `http://localhost:4000`.

### 2. Start the frontend

Open a second terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

Both development servers must remain running while using the application.

## Sample Quiz

To add a sample quiz to the database:

```bash
cd backend
npm run db:seed
```

You can also create a quiz from `http://localhost:3000/create`:

1. Enter a quiz title.
2. Add one or more questions.
3. Choose True / False, Short answer, or Multiple choice.
4. Enter the correct answer and submit the form.

## API

| Method   | Endpoint       | Description                |
| -------- | -------------- | -------------------------- |
| `POST`   | `/quizzes`     | Create a quiz              |
| `GET`    | `/quizzes`     | List quizzes               |
| `GET`    | `/quizzes/:id` | Get full quiz details      |
| `DELETE` | `/quizzes/:id` | Delete a quiz              |
| `GET`    | `/health`      | Check backend availability |

## Quality Checks

Run these commands inside both `frontend` and `backend`:

```bash
npm run lint
npm run format:check
npm run build
```

Run backend integration tests:

```bash
cd backend
npm test
```
