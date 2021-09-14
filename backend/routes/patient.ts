import { Router, Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";

import { HandleNewPatient } from "controllers/patient";

import { new_patient_schema } from "routes/schemas/patient";

import { logger } from "util/logger";

import type { API } from "@sem5-webdev/types";

const router = Router();

router.post(
  "/add",
  checkSchema(new_patient_schema),
  async (req: Request, res: Response<API.Response>) => {
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
      console.log(err);

      return res.status(400).json({ success: false, err });
    }

    try {
      const id = await HandleNewPatient(req.body);

      logger("New patient info saved", "success");
      res.status(200).json({ success: true, data: id });
    } catch (error) {
      logger("Error occured while saving patient info", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;
