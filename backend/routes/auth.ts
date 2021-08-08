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
      const { access_token, refresh_token, err } = await HandleLogin(
        req.body.username,
        req.body.password
      );

      // send response
      if (err) {
        res.status(503).json({ err: err.toString() });
      } else {
        // set refresh token in cookie
        res.cookie("token", refresh_token, {
          domain: "localhost:3001",
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          secure: true, // https or localhost
        });
        res.status(200).json(access_token);
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
      const { access_token, refresh_token, err } = await HandleRegister(
        req.body
      );

      // send response
      if (err) {
        res.status(503).json({ err: err.toString() });
      } else {
        // set refresh token in cookie
        res.cookie("token", refresh_token, {
          domain: "localhost:3001",
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          secure: true, // https or localhost
        });
        res.status(200).json(access_token);
      }
    } catch (error) {
      logger(`Error occured while creating user ${req.body.email}`, "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;
