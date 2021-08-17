import knex from "knex";

const pg = knex({
  client: "pg",
  version: "13.3",
  connection: {
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || "3002"),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
  debug: false,
});

export { pg };
