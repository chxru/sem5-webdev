import db from "database/pg";
import { DecryptData, EncryptData } from "util/crypto";
import { logger } from "util/logger";

import { DB } from "@sem5-webdev/types";

/**
 * Add new entry to bed ticket table
 *
 * @param {string} bid
 * @param {PGDB.Patient.BedTicketEntry} data
 * @return {*}  {Promise<{ err?: string }>}
 */
export default async (
  bid: string,
  data: DB.Patient.BedTicketEntry
): Promise<{ err?: string }> => {
  const trx = await db.connect();
  try {
    await trx.query("BEGIN");

    const q1 = await trx.query(
      "SELECT records FROM patients.bedtickets WHERE id=$1",
      [bid]
    );

    if (q1.rowCount === 0) {
      return { err: "Bed Ticket ID not found" };
    }

    const records = q1.rows[0].records;

    // decrypting data
    const decrypted =
      records === null
        ? [] // in fresh bed tickets records is null
        : DecryptData<DB.Patient.BedTicketEntry[]>(records);

    // insert new entry to saved array
    decrypted.unshift({
      ...data,
      created_at: new Date(),
      id: decrypted.length + 1,
    });

    // encrypting again
    const encrypted = EncryptData(JSON.stringify(decrypted));

    // updating database
    await trx.query("UPDATE patients.bedtickets SET records=$1 WHERE id=$2", [
      encrypted,
      bid,
    ]);

    // commiting
    await trx.query("COMMIT");
  } catch (error) {
    await trx.query("ROLLBACK");

    logger("Error occured while HandleNewEntry transaction", "error");
    throw error;
  } finally {
    trx.release();
  }

  return { err: undefined };
};
