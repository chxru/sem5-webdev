import { pg } from "./knex";

interface NewUserDataInterface {
  email: string;
  fname: string;
  lname: string;
  password: string;
}
/**
 * Save new user to the database
 *
 * @param {NewUserDataInterface} data
 * @return {*}  {Promise<number>}
 */
const SaveNewUserDB = async (data: NewUserDataInterface): Promise<number> => {
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

    // updating user auth tablel
    await trx("users.auth").insert({
      id: uid[0],
      username: data.email,
      pwd: data.password,
    });

    return uid[0];
  });
  return id;
};

export { SaveNewUserDB };
