import express, { Router } from "express";
import { checkSchema, validationResult } from "express-validator";

import { HandleLogin, HandleRegister } from "../controllers/auth";
import { signin_schema, signup_schema } from "./schemas/auth";

import { logger } from "../util/logger";

const router = Router();

router.post(
  "/login",
  checkSchema(signin_schema),
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { jwt, err } = await HandleLogin(
        req.body.username,
        req.body.password
      );

      // set cookie
      res.cookie("token", jwt, {
        domain: "localhost:3001",
        httpOnly: true,
        maxAge: 3600 * 1000,
        secure: true,
      });

      // send response
      if (err) {
        res.status(503).json({ err: err.toString() });
      } else {
        res.sendStatus(200);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/create",
  checkSchema(signup_schema),
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { jwt, err } = await HandleRegister(req.body);

      // set cookie
      res.cookie("token", jwt, {
        domain: "localhost:3001",
        httpOnly: true,
        maxAge: 3600 * 1000,
        secure: true,
      });

      // send response
      if (err) {
        res.status(503).json({ err: err.toString() });
      } else {
        res.sendStatus(200);
      }
    } catch (error) {
      logger(`Error occured while creating user ${req.body.email}`, "error");
      console.error(error);
      res.sendStatus(500);
    }

    res.sendStatus(200);
  }
);

export default router;
