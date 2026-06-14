import "./models.js";
import { sequelize } from "./sequelize.js";

export async function setupDatabase() {
  await sequelize.authenticate();
  await sequelize.sync();
}

if (process.argv[1]?.endsWith("setup.ts")) {
  setupDatabase()
    .then(async () => {
      console.log("Database is ready.");
      await sequelize.close();
    })
    .catch(async (error: unknown) => {
      console.error("Database setup failed.", error);
      await sequelize.close();
      process.exit(1);
    });
}
