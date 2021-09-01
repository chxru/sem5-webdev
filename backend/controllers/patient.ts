import { SaveNewPatientDB } from "../database/patients";
import { EncryptData } from "../util/crypto";

const HandleNewPatient = async (data: API.PatientRegistrationFormData) => {
  const encrypted = EncryptData(data);
  await SaveNewPatientDB(encrypted);
};

export { HandleNewPatient };
