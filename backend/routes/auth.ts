import express, { Router } from "express";
import {
  check,
  checkSchema,
  Schema,
  validationResult,
} from "express-validator";

import { HandleLogin, HandleRegister } from "../controllers/auth";

import { logger } from "../util/logger";

// schemas
const signup_schema: Schema = {
  email: {
    in: "body",
    errorMessage: "Invalid email",
    isEmail: true,
    trim: true,
  },
  fname: {
    in: "body",
    isString: true,
    errorMessage: "Invalid First Name",
    trim: true,
  },
  lname: {
    in: "body",
    isString: true,
    errorMessage: "Invalid Last Name",
    trim: true,
  },
  username: {
    in: "body",
    isString: true,
    errorMessage: "Invalid username",
    isLength: {
      errorMessage: "Username must be atleast 5 letters",
      options: {
        min: 5,
      },
    },
    trim: true,
  },
  password: {
    in: "body",
    isStrongPassword: true,
    errorMessage: "Password isn't strong enough",
  },
};

const signin_schema: Schema = {
  username: {
    in: "body",
    errorMessage: "Invalid email",
    isEmail: true,
    trim: true,
  },
  password: {
    in: "body",
    isString: true,
    errorMessage: "Invalid password",
  },
};

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
      const { res: result, err } = await HandleLogin(
        req.body.username,
        req.body.password
      );
      res.status(200).json({ result, err });
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
      await HandleRegister(req.body);
    } catch (error) {
      logger(`Error occured while creating user ${req.body.email}`, "error");
      console.error(error);
      res.sendStatus(500);
    }

    res.sendStatus(200);
  }
);

export default router;
