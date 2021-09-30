import db from "database/pg";

import { HashPwd } from "util/bcrypt";
import { GenerateJWT } from "util/jwt";
import { logger } from "util/logger";

import type { API } from "@sem5-webdev/types";

/**
 * Handle new user registration process
 *
 * @param {API.RegisterData} data new users details
 */
export default async (
  data: API.Auth.RegisterData
): Promise<{ access_token: string; refresh_token: string }> => {
  const hashedPwd = await HashPwd(data.password);

  // saving in database
  const trx = await db.connect();
  let id: number;

  try {
    // begin trasaction
    await trx.query("BEGIN");

    // insert data into users.data
    const q1 = await trx.query(
      "INSERT INTO users.data (email, fname, lname) VALUES ($1, $2, $3) RETURNING id",
      [data.email, data.fname, data.lname]
    );

    // update uid
    id = q1.rows[0].id;

    // insert data into users.auth
    await trx.query(
      "INSERT INTO users.auth (id, username, pwd) VALUES ($1, $2, $3)",
      [id, data.email, hashedPwd]
    );

    // commiting
    await trx.query("COMMIT");
  } catch (error) {
    // rallback
    await trx.query("ROLLBACK");

    logger("Error occured in HandleRegister transcation, rollbacked", "error");
    throw error;
  } finally {
    trx.release();
  }

  // Generate JWT
  const access_token = await GenerateJWT(id, "access");
  const refresh_token = await GenerateJWT(id, "refresh");

  // save token in db
  const expires = new Date();
  expires.setDate(expires.getDate() + 1); // set expire date to 1 day
  await db.query(
    "INSERT INTO users.tokens (id, token, expires) VALUES ($1, $2, $3)",
    [id, refresh_token, expires]
  );

  logger(`User ${data.email} is created`, "success");

  return { access_token, refresh_token };
};
