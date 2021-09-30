import db from "database/pg";
import { EncryptData } from "util/crypto";

import type { API } from "@sem5-webdev/types";

export default async (data: API.Patient.RegistrationForm): Promise<number> => {
  const encrypted = EncryptData(JSON.stringify(data));

  const query = await db.query<{ id: number }>(
    "INSERT INTO patients.info (data) VALUES ($1) RETURNING id",
    [encrypted]
  );

  const pid = query.rows[0].id;

  return pid;
};
