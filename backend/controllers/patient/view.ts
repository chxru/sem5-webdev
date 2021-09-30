import db from "database/pg";
import { DecryptData } from "util/crypto";

import type { DB } from "@sem5-webdev/types";

export default async (
  pid: string
): Promise<{ data?: DB.Patient.Data; err?: string }> => {
  const id = parseInt(pid);
  if (isNaN(id)) {
    return { err: "ID is not a number" };
  }

  const query = await db.query("SELECT * FROM patients.info WHERE id=$1", [id]);
  if (query.rowCount === 0) {
    return { err: "No patient found" };
  }

  const encrypted: DB.Encrypted = query.rows[0];
  const data = DecryptData<DB.Patient.Data>(encrypted.data);
  return { data };
};
