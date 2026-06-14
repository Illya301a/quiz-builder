# Quiz Builder Backend

Express API for storing and managing quizzes with Sequelize and SQLite.

## Setup

Create the local environment file:

```bash
cp .env.example .env
```

Install dependencies and create the SQLite database:

```bash
npm install
npm run db:setup
```

Optionally create a sample quiz:

```bash
npm run db:seed
```

Start the API at `http://localhost:4000`:

```bash
npm run dev
```

## Checks

```bash
npm run lint
npm run format:check
npm run build
npm test
```
