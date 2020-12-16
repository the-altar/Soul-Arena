import { Pool } from "pg";
import { postgres } from "./config.json";

export const pool = new Pool({
  connectionString:
    process.env.NODE_ENV == "dev"
      ? `postgres://${postgres.user}:${postgres.password}@${postgres.host}:${postgres.port}/${postgres.database}`
      : process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
