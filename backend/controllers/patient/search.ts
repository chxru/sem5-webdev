import db from "database/pg";
import type { API } from "@sem5-webdev/types";

export default async (
  content: string
): Promise<API.Patient.SearchDetails[]> => {
  if (!content) {
    return [];
  }

  const query = await db.query(
    "SELECT * FROM patients.search WHERE full_name ILIKE $1",
    [`%${content}%`]
  );

  return query.rows;
};
