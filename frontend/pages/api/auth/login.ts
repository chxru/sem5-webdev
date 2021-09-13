// @ts-nocheck

import fetch from "node-fetch";
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseType = {
  success: boolean;
  user?: API.UserData;
  err?: string;
  desc?: string;
  access?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  try {
    const sr = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(req.body),
    });

    if (!sr.ok) {
      const desc = await sr.text();
      res.status(500).json({
        success: false,
        err: "Error occured in internal server",
        desc,
      });
      return;
    }

    const { success, user, access, refresh, err }: API.LoginResponse =
      await sr.json();

    if (!success) {
      res.status(200).json({ success, err });
      return;
    }

    if (!access || !refresh) {
      res.status(500).json({ success: false, err: "Tokens are missing" });
      return;
    }

    const header = serialize("refresh_token", refresh, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: true,
    });

    res.setHeader("Set-Cookie", header);
    res.status(200).json({ success, user, access });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: "Error occured in next server",
      desc: error.toString(),
    });
  }
}
