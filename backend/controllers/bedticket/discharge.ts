import db from "database/pg";
import { DecryptData, EncryptData } from "util/crypto";
import { logger } from "util/logger";

import { DB } from "@sem5-webdev/types";

/**
 * Discharge patient by updating bed ticket
 *
 * @param {string} pid Patient ID
 * @return {*}  {Promise<{ err?: string }>}
 */
export default async (pid: string): Promise<{ err?: string }> => {
  /*
    1. Fetch general information of patient, decrypt it
    2. Update current_bedticket to undefined
    3. Update discharge_date to current time
    4. 
  */

  const trx = await db.connect();

  try {
    await trx.query("BEGIN");

    // fetch patient data
    const q1 = await trx.query("SELECT data FROM patients.info WHERE id=$1", [
      pid,
    ]);

    if (q1.rowCount === 0) {
      return { err: "User ID not found" };
    }

    // decrypting data
    const decrypted = DecryptData<DB.Patient.Data>(q1.rows[0].data);

    if (!decrypted.current_bedticket) {
      return { err: "User doesn't have an active bed ticket" };
    }

    const bid = decrypted.current_bedticket;
    // set current bedticket undefined
    decrypted.current_bedticket = undefined;

    // find the entry with matching bid, add discharge timestamp
    decrypted.bedtickets = decrypted.bedtickets.map((b) => {
      if (b.id == bid) {
        return { ...b, discharge_date: Date.now() };
      }
      return b;
    });

    // encrypting updated data
    const encrypted = EncryptData(JSON.stringify(decrypted));

    // updating database
    await trx.query("UPDATE patients.info SET data=$1 WHERE id=$2", [
      encrypted,
      pid,
    ]);

    // updating stats.beds
    await trx.query(
      "UPDATE stats.beds SET pid=NULL, bid=NULL, name=NULL, updated_on=$2 WHERE bid=$1",
      [bid, Date.now()]
    );

    // commiting
    await trx.query("COMMIT");
  } catch (error) {
    // rollback
    await trx.query("ROLLBACK");

    logger("Error occured while HandleNewBedTicket transaction", "error");
    throw error;
  } finally {
    trx.release();
  }
  return { err: undefined };
};
