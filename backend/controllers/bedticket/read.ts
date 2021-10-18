import db from "database/pg";
import { DecryptData } from "util/crypto";
import { logger } from "util/logger";

import { DB } from "@sem5-webdev/types";

/**
 * Read all entries of bed ticket
 *
 * @param {string} bid
 * @return {*}
 */
export default async (
  bid: string
): Promise<{ data?: DB.Patient.BedTicketEntry[]; err?: string }> => {
  try {
    const query = await db.query(
      "SELECT records FROM patients.bedtickets WHERE id=$1",
      [bid]
    );

    if (query.rowCount === 0) {
      return { err: "Bed Ticket ID not found" };
    }

    const records = query.rows[0].records;

    // decrypting data
    const decrypted =
      records === null
        ? [] // in fresh bed tickets records is null
        : DecryptData<DB.Patient.BedTicketEntry[]>(records);

    return { data: decrypted };
  } catch (error) {
    logger("Error occured while HandleNewEntry transaction", "error");
    console.log(error);

    return { err: "Error occured while fetching new entries" };
  }
};
