import db from "database/pg";
import { API } from "@sem5-webdev/types";

const FetchBedData = async (): Promise<API.Stats.Beds[]> => {
  const query = await db.query<API.Stats.Beds>(
    "SELECT id, pid, name, updated_on FROM stats.beds"
  );

  return query.rows;
};

export { FetchBedData };
