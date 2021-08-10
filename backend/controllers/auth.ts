import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { pg } from "../database/knex";

interface RegisterData {
  email: string;
  fname: string;
  lname: string;
  password: string;
}

/**
 * Generate hash of the user's password
 *
 * @param {string} pwd
 * @return {*}
 */
const HashPwd = (pwd: string) => {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(pwd, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
};

/**
 * Compare given password with the hash
 *
 * @param {string} pwd
 * @param {string} hash
 * @return {*}  {Promise<boolean>}
 */
const ComparePwd = (pwd: string, hash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pwd, hash, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

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
 * Generate Json web token
 *
 * @param {number} id User ID
 * @param {("refresh" | "access")} type
 * @return {*}  {Promise<string>}
 */
const GenerateJWT = (
  id: number,
  type: "refresh" | "access"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let token =
      type === "refresh"
        ? process.env.JWT_REFRESH_TOKEN
        : process.env.JWT_ACCESS_TOKEN;

    // FIXME: Bad practice
    if (!token) {
      token = "justtobypasstypeerror :)";
    }

    jwt.sign(
      { id },
      token,
      { expiresIn: token === "refresh" ? "7d" : 60 * 15 }, // refresh token 7days, access token 15mins
      (err, token) => {
        if (!!token) {
          resolve(token);
        }

        // reject if no token is generated
        reject(err);
      }
    );
  });
};

/**
 * Handle new user registration process
 *
 * @param {RegisterData} data new users details
 */
const HandleRegister = async (data: RegisterData) => {
  try {
    const id: number = await pg.transaction(async (trx) => {
      // insert user data to database
      const uid = await trx("users.data").insert(
        {
          email: data.email,
          fname: data.fname,
          lname: data.lname,
        },
        "id"
      );

      // hashing password
      const hash = await HashPwd(data.password);

      // updating user auth tablel
      await trx("users.auth").insert({
        id: uid[0],
        username: data.email,
        pwd: hash,
      });

      return uid[0];
    });

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

export { HandleLogin, HandleRegister };
