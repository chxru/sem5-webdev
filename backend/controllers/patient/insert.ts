import db from "database/pg";
import { EncryptData } from "util/crypto";
import { logger } from "util/logger";

import type { API } from "@sem5-webdev/types";

export default async (data: API.Patient.RegistrationForm): Promise<number> => {
  const encrypted = EncryptData(JSON.stringify(data));
  const fullname = data.fname + " " + data.lname;

  let pid: number;

  // begin transaction
  const trx = await db.connect();
  try {
    await trx.query("BEGIN");

    // save encrypted data in patients.info
    const q1 = await db.query(
      "INSERT INTO patients.info (data) VALUES ($1) RETURNING id",
      [encrypted]
    );

    // get patient id
    pid = q1.rows[0].id;

    // insert full name to patients.search
    await trx.query("INSERT INTO patients.search VALUES ($1, $2)", [
      pid,
      fullname,
    ]);

    // commiting
    await trx.query("COMMIT");
  } catch (error) {
    // rallback
    await trx.query("ROLLBACK");

    logger(
      "Error occured in HandleNewPatient transcation, rollbacked",
      "error"
    );
    throw error;
  } finally {
    trx.release();
  }

  return pid;
};
