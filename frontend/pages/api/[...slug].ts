/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import fetch, { Headers } from "node-fetch";

import type { API } from "@sem5-webdev/types";
import { logger } from "util/logger";

const VerifyJWT = async (token: string) => {
  return new Promise<void>((resolve, reject) => {
    if (!process.env.JWT_ACCESS_TOKEN) {
      reject(new Error("Env variable JWT_ACCESS_TOKEN is missing"));
      return;
    }

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<API.Response>
) {
  const { slug } = req.query;
  const token = req.headers.authorization;

  // verify jwt token is valid
  try {
    if (!token) {
      throw new Error("Missing token");
    }

    await VerifyJWT(token);
  } catch (error) {
    console.log(error);
    res.status(403).json({ success: false, err: "JWT Verification failed" });
    return;
  }

  try {
    const headers = new Headers();
    if (req.headers["content-type"]) {
      headers.append(
        "Content-Type",
        req.headers["content-type"] ?? "application/json;charset=utf-8"
      );
    }
    headers.append("Authorization", token);

    // Is there a better way to differ FormData and JSON? 🤔
    const body =
      req.body.toString() === "[object FormData]"
        ? req.body
        : Object.entries(req.body).length != 0
        ? JSON.stringify(req.body)
        : undefined;

    const url = typeof slug === "string" ? slug : slug.join("/");
    const response = await fetch(`http://localhost:3001/${url}`, {
      method: req.method,
      headers,
      body,
    });

    if (!response.ok) {
      // 400 => schema validation failed
      if (response.status === 400) {
        const { err } = (await response.json()) as API.Response;
        res.status(400).json({ success: false, err });
        return;
      }

      // 500 => backend errors
      if (response.status === 500) {
        res.status(500).json({
          success: false,
          err: "Internal server error occured, contact admin",
        });
      }
      return;
    }

    const { data } = (await response.json()) as API.Response;
    res.status(200).json(data || {});
  } catch (error) {
    logger("Error occured in internal server", "error");
    console.error(error);

    res.status(502);
  }
}
