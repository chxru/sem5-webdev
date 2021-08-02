import express from "express";
import * as jwt from "jsonwebtoken";

const verifyToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // skip token verification for /auth/login
  if (req.path === "/auth/login") {
    next();
    return;
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log(req.headers);
    return res.sendStatus(403);
  }

  jwt.verify(token, process.env.JWT_TOKEN as string, (err, user) => {
    console.log(user, err);

    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }

    next();
  });
};

export { verifyToken };
