import db from "database/pg";

import { ComparePwd, HashPwd } from "util/bcrypt";
import { DecodeJWT, GenerateJWT } from "util/jwt";
import { logger } from "util/logger";

import type { API, DB } from "@sem5-webdev/types";

/**
 * Handle new user registration process
 *
 * @param {API.RegisterData} data new users details
 */
const HandleRegister = async (
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

/**
 * Handle user authentication process
 *
 * @param {string} username email at this stage
 * @param {string} password
 * @return {*}  {Promise<{ jwt?: string; err?: string }>}
 */
const HandleLogin = async (
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

/**
 * Handle token refreshing.
 * When user requests a new refresh token with the access token,
 * function verify the access token and issue a new refresh token
 *
 * @param {string} token access
 * @return {*}  {(Promise<{
 *   ok: boolean;
 *   access?: string;
 *   user?: {id: string; fname: string; lname: string; email: string};
 * }>)}
 */
const HandleRefreshToken = async (
  token: string
): Promise<{ ok: boolean; access?: string; user?: API.Auth.UserData }> => {
  // decode jwt
  const { ok, err, payload } = await DecodeJWT(token);

  if (!ok || !payload) {
    logger(err || "JWT Decode unknown error", "info");
    return { ok: false };
  }

  const uid = JSON.parse(payload).id;
  if (!uid) {
    logger("JWT Payload doesnt have uid value", "error");
    return { ok: false };
  }

  // check database for saved uid+token combinations
  // TODO: Check the token is blacklisted
  const query = await db.query<Pick<DB.User.Tokens, "id" | "token">>(
    "SELECT id, token FROM users.tokens WHERE id=$1 AND token=$2",
    [uid, token]
  );
  if (query.rowCount === 0) {
    throw new Error("No id, token combination found");
  }

  // generate new access token
  const access = await GenerateJWT(uid, "access");

  // get user data
  // TODO: Separte db logics from controller
  const userQuery = await db.query<API.Auth.UserData>(
    "SELECT id, fname, lname, email FROM users.data WHERE id=$1",
    [uid]
  );
  if (userQuery.rowCount === 0) {
    logger(`Could not fetch token data for id=${uid}`, "error");
    throw new Error("User data is missing in database, contact admin");
  }

  // grab user data from the query result
  const user = userQuery.rows[0];

  return { ok, access, user };
};

export { HandleLogin, HandleRegister, HandleRefreshToken };
