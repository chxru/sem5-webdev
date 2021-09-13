import { pg } from "database/knex";

const SaveNewPatientDB = async (data: string): Promise<number> => {
  const q = await pg("patients.info").insert({ data }).returning("id");

  // returns id
  return q[0];
};

export { SaveNewPatientDB };
