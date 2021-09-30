import db from "database/pg";

export default async (): Promise<number> => {
  const query = await db.query<{ count: number }>(
    "SELECT COUNT(*) FROM users.data"
  );
  return query.rows[0].count;
};
