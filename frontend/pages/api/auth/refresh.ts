import fetch from "node-fetch";

import type { NextApiRequest, NextApiResponse } from "next";
import type { API } from "@sem5-webdev/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<API.Response>
) {
  // filter POST requests
  if (req.method !== "POST") {
    res.status(403).json({
      success: false,
      err: `No ${req.method} requests accepted in this endpoint`,
    });
    return;
  }

  // reply if no token came in the cookie
  const refresh: string | undefined = req.cookies.refresh_token;
  if (!refresh) {
    res.status(403).json({ success: true, err: "No token" });
    return;
  }

  // generate new access token from backend
  try {
    const sr = await fetch("http://localhost:3001/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (sr.status === 400) {
      const data = (await sr.json()) as API.Response;
      res.status(400).json({ success: false, err: data.err });
    }

    if (!sr.ok) {
      res.status(500).json({
        success: false,
        err: "Error occured in next server",
      });
    }

    const data = (await sr.json()) as API.Response;
    res.status(200).json({ success: true, data: data.data });
  } catch (error) {
    res.status(502).json({
      success: false,
      err: "Error occured in next server",
    });
  }
}
