import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { pg } from "../database/knex";

interface RegisterData {
  email: string;
  fname: string;
  lname: string;
  password: string;
}

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
 * Generate Json web token
 *
 * @param {string} username
 * @return {*}  {Promise<string>}
 */
const GenerateJWT = (username: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username },
      process.env.JWT_TOKEN || "justtobypasstypeerror :)",
      { expiresIn: "1d" },
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
    await pg.transaction(async (trx) => {
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
    });

    // Generate JWT
    const token = await GenerateJWT(data.email);
    return { jwt: token };
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
): Promise<{ jwt?: string; err?: string }> => {
  try {
    const savedHash = await pg("users.auth").where({ username }).select("pwd");

    if (savedHash.length === 0) {
      throw new Error("Username not correct");
    }

    const res = await ComparePwd(password, savedHash[0].pwd);

    if (!res) {
      return { err: "Wrong username/password" };
    }

    try {
      const token = await GenerateJWT(username);
      return { jwt: token };
    } catch (err) {
      return { err };
    }
  } catch (error) {
    return { err: error };
  }
};

export { HandleLogin, HandleRegister };
