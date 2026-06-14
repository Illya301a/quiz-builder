import { app } from "./app.js";
import { env } from "./config/env.js";
import { setupDatabase } from "./database/setup.js";
import { sequelize } from "./database/sequelize.js";

await setupDatabase();

const server = app.listen(env.PORT, () =>
  console.log(`API is running at http://localhost:${env.PORT}`),
);

async function shutdown() {
  server.close(async () => {
    await sequelize.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
