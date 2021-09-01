import { Router, Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import { HandleNewPatient } from "../controllers/patient";
import { logger } from "../util/logger";
import { new_patient_schema } from "./schemas/patient";

const router = Router();

router.post(
  "/add",
  checkSchema(new_patient_schema),
  async (req: Request, res: Response) => {
    logger("/patient/add");

    // schema validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // concat array of errors to one string
      const err = errors
        .array()
        .map((i) => `${i.param}: ${i.msg}`)
        .join("\n");
      logger("Login schema validation failed", "info");
      return res.status(400).json({ success: false, err });
    }

    try {
      const data: API.PatientRegistrationFormData = req.body;
      await HandleNewPatient(data);

      logger("New patient info saved", "success");
      res.sendStatus(200);
    } catch (error) {
      logger("Error occured while saving patient info", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;
