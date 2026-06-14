import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { Sequelize } from "sequelize";
import { env } from "../config/env.js";

const databasePath = resolve(process.cwd(), env.DATABASE_PATH);

mkdirSync(dirname(databasePath), { recursive: true });

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: databasePath,
  logging: false,
});
