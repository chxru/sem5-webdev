import express from "express";
import * as jwt from "jsonwebtoken";
import { VerifyJWT } from "util/jwt";
import { logger } from "util/logger";

const verifyToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // skip token verification for /auth
  if (req.path.startsWith("/auth")) {
    next();
    return;
  }

  const token = req.headers["authorization"];

  if (!token) {
    logger(`Token is missing for request ${req.path}`);
    return res.sendStatus(403);
  }

  if (VerifyJWT(token)) {
    next();
  } else {
    return res.sendStatus(403);
  }
};

export { verifyToken };
