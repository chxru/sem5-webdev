import { SaveNewPatientDB } from "database/patients";
import { EncryptData } from "util/crypto";

import type { API } from "@sem5-webdev/types";

const HandleNewPatient = async (data: API.PatientRegistrationFormData) => {
  const encrypted = EncryptData(data);
  await SaveNewPatientDB(encrypted);
};

export { HandleNewPatient };
