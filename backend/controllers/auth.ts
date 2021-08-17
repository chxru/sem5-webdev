import { pg } from "../database/knex";
import { ComparePwd, HashPwd } from "../util/bcrypt";
import { DecodeJWT, GenerateJWT } from "../util/jwt";
import { FetchRefreshToken, SaveRefreshToken } from "../database/tokens";
import { SaveNewUserDB } from "../database/users";
import { logger } from "../util/logger";

interface RegisterData {
  email: string;
  fname: string;
  lname: string;
  password: string;
}

/**
 * Handle new user registration process
 *
 * @param {RegisterData} data new users details
 */
const HandleRegister = async (data: RegisterData) => {
  try {
    const hashedPwd = await HashPwd(data.password);
    const id: number = await SaveNewUserDB({ ...data, password: hashedPwd });

    // Generate JWT
    const access_token = await GenerateJWT(id, "access");
    const refresh_token = await GenerateJWT(id, "refresh");

    // save token in db
    await SaveRefreshToken(id, refresh_token);

    return { access_token, refresh_token };
  } catch (error) {
    return { err: error };
  }
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
  user?: API.UserData;
  access_token?: string;
  refresh_token?: string;
  err?: string;
}> => {
  try {
    // get user auth data
    // TODO: Separte db logics from controller
    const userAuthData = await pg("users.auth")
      .where({ username })
      .select("pwd", "id");

    if (userAuthData.length === 0) {
      throw new Error("Username not correct");
    }

    const res = await ComparePwd(password, userAuthData[0].pwd);

    if (!res) {
      return { err: "Wrong username/password" };
    }

    // get user data
    // TODO: Separte db logics from controller
    const user = await pg("users.data")
      .where({ id: userAuthData[0].id })
      .select("id", "fname", "lname", "email");

    // grab user data from the query result
    const { id, fname, lname, email } = user[0];

    const access_token = await GenerateJWT(id, "access");
    const refresh_token = await GenerateJWT(id, "refresh");

    await SaveRefreshToken(id, refresh_token);

    return { user: { id, fname, lname, email }, access_token, refresh_token };
  } catch (error) {
    return { err: error };
  }
};

const HandleRefreshToken = async (
  token: string
): Promise<{ ok: boolean; access?: string; user?: API.UserData }> => {
  try {
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
    await FetchRefreshToken(parseInt(uid), token);

    // generate new access token
    const access = await GenerateJWT(uid, "access");

    // get user data
    // TODO: Separte db logics from controller
    const user = await pg("users.data")
      .where({ id: uid })
      .select("id", "fname", "lname", "email");

    // grab user data from the query result
    const { id, fname, lname, email } = user[0];

    return { ok, access, user: { id, fname, lname, email } };
  } catch (error) {
    logger("Error occured while Handle Refresh Token", "error");
    console.log(error);
    return { ok: false };
  }
};

export { HandleLogin, HandleRegister, HandleRefreshToken };
