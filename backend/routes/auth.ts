import express, { Router } from "express";
import { checkSchema, validationResult } from "express-validator";

import { HandleLogin, HandleRegister } from "../controllers/auth";
import { signin_schema, signup_schema } from "./schemas/auth";

import { logger } from "../util/logger";

const router = Router();

router.post(
  "/login",
  checkSchema(signin_schema),
  async (req: express.Request, res: express.Response<API.LoginResponse>) => {
    // schema validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // concat array of errors to one string
      const err = errors
        .array()
        .map((i) => `${i.param}: ${i.msg}`)
        .join("\n");
      return res.status(400).json({ success: false, err });
    }

    try {
      const { user, access_token, refresh_token, err } = await HandleLogin(
        req.body.username,
        req.body.password
      );

      // send response
      if (err) {
        res.status(200).json({ success: false, err: err.toString() });
      } else {
        res.status(200).json({
          success: true,
          user,
          access: access_token,
          refresh: refresh_token,
        });
      }
    } catch (err) {
      res.status(500).json({ success: false, err });
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
