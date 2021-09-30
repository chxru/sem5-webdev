import db from "database/pg";

import { ComparePwd } from "util/bcrypt";
import { GenerateJWT } from "util/jwt";
import { logger } from "util/logger";

import type { API, DB } from "@sem5-webdev/types";

/**
 * Handle user authentication process
 *
 * @param {string} username email at this stage
 * @param {string} password
 * @return {*}  {Promise<{ jwt?: string; err?: string }>}
 */
export default async (
  username: string,
  password: string
): Promise<{
  user: Pick<DB.User.Data, "id" | "fname" | "lname" | "email">;
  access_token: string;
  refresh_token: string;
}> => {
  // get user auth data
  const userAuthQuery = await db.query(
    "SELECT id, pwd FROM users.auth WHERE username=$1",
    [username]
  );

  if (userAuthQuery.rowCount === 0) {
    logger(`Username ${username} not found`, "info");
    throw new Error("Username not correct");
  }

  const userAuthData: Pick<DB.User.Auth, "id" | "pwd"> = userAuthQuery.rows[0];

  const res = await ComparePwd(password, userAuthData.pwd);

  if (!res) {
    throw new Error("Wrong username/password");
  }

  // get user data
  const userQuery = await db.query(
    "SELECT id, fname, lname, email FROM users.data WHERE id=$1",
    [userAuthData.id]
  );

  if (userQuery.rowCount === 0) {
    logger(
      `Could not fetch row for ${username}, id=${userAuthData.id}`,
      "error"
    );
    throw new Error("User data is missing in database, contact admin");
  }

  // grab user data from the query result
  const user: Pick<DB.User.Data, "id" | "fname" | "lname" | "email"> =
    userQuery.rows[0];

  const access_token = await GenerateJWT(userAuthData.id, "access");
  const refresh_token = await GenerateJWT(userAuthData.id, "refresh");

  // save token in db
  const expires = new Date();
  expires.setDate(expires.getDate() + 1); // set expire date to 1 day
  await db.query(
    "INSERT INTO users.tokens (id, token, expires) VALUES ($1, $2, $3)",
    [user.id, refresh_token, expires]
  );

  logger(`User ${user.email} logged in`, "success");

  return { user, access_token, refresh_token };
};
