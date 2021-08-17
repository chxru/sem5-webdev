import { pg } from "./knex";

/**
 * Save refresh token in database users.token
 *
 * @param {number} id
 * @param {string} token
 */
const SaveRefreshToken = async (id: number, token: string) => {
  // create a date for now+7days
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  await pg("users.tokens").insert({ id, token, expires });
};

/**
 * Fetch if there is a valid token + uid combination.
 * Throw if search result is empty
 *
 * @param {number} id
 * @param {string} token
 */
const FetchRefreshToken = async (id: number, token: string) => {
  const t = await pg("users.tokens").where({ id, token }).select("token");
  if (!t.length || !t[0].token) {
    throw new Error("No records about given token");
  }
};

export { SaveRefreshToken, FetchRefreshToken };
