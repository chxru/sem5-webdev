import { Pool } from "pg";
import { logger } from "util/logger";

const pg = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "3002"),
});

// pg events
pg.on("connect", () => {
  logger("pg connection initiated");
});

export default pg;
