import db from "database/pg";

import { DecodeJWT, GenerateJWT } from "util/jwt";
import { logger } from "util/logger";

import type { API, DB } from "@sem5-webdev/types";

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
export default async (
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
