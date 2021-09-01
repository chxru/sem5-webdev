import { pg } from "./knex";

interface PatientEncryptedDataInterface {
  id: number;
  data: string;
}

const SaveNewPatientDB = async (data: string): Promise<number> => {
  const q = await pg("patients.info").insert({ data }).returning("id");

  // returns id
  return q[0];
};

export { SaveNewPatientDB };
