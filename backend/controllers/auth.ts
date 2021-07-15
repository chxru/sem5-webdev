import * as bcrypt from "bcrypt";
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
  } catch (error) {
    console.error(error);
  }
};

export { HandleRegister };
