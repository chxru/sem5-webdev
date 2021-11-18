import { Router, Request, Response } from "express";
import { FetchBedData } from "controllers/stats";

import { logger } from "util/logger";

import type { API } from "@sem5-webdev/types";

const router = Router();

router.get(
  "/beds",
  async (_req: Request, res: Response<API.Response<API.Stats.Beds[]>>) => {
    try {
      const data = await FetchBedData();
      res.status(200).json({ success: true, data });
    } catch (error) {
      logger("Error occured while fetching beds stats", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;
