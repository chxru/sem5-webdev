import { Router } from "express";
import { check } from "express-validator";
import { pg } from "../database/knex";

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

router.post("/create", (req, res) => {
  res.sendStatus(200);
});

export default router;
