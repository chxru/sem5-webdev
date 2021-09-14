import db from "database/pg";
import { DecryptData, EncryptData } from "util/crypto";

import type { API, DB } from "@sem5-webdev/types";

const HandleNewPatient = async (
  data: API.Patient.RegistrationForm
): Promise<number> => {
  const encrypted = EncryptData(JSON.stringify(data));

  const query = await db.query<{ id: number }>(
    "INSERT INTO patients.info (data) VALUES ($1) RETURNING id",
    [encrypted]
  );

  const pid = query.rows[0].id;

  return pid;
};

const HandlePatientBasicInfo = async (
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

export { HandleNewPatient, HandlePatientBasicInfo };
