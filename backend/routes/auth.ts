import express, { Router } from "express";
import {
  check,
  checkSchema,
  Schema,
  validationResult,
} from "express-validator";
import { HandleRegister } from "../controllers/auth";
import { pg } from "../database/knex";

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

const router = Router();

router.post(
  "/login",
  check("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  check("password")
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage("Invalid password"),
  (req, res) => {
    pg.select("id")
      .from("test")
      .then((r) => console.log(r))
      .catch((e) => console.error(e));
    res.sendStatus(200);
  }
);

router.post(
  "/create",
  checkSchema(signup_schema),
  (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    HandleRegister(req.body);
    res.sendStatus(200);
  }
);

export default router;
