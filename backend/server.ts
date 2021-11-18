import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import { verifyToken } from "middleware/authverify";
import { logger } from "util/logger";

// routes
import authroutes from "routes/auth";
import patientroutes from "routes/patient";
import bedticketRoutes from "routes/bedticket";
import statsRoutes from "routes/stats";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("dev"));
app.use(verifyToken);

app.use("/auth", authroutes);
app.use("/patient", patientroutes);
app.use("/bedtickets", bedticketRoutes);
app.use("/stats", statsRoutes);

app.use(
  "/files",
  express.static(path.join(__dirname, "../", "uploads", "bedtickets"))
);

app.all("*", (req, res) => {
  logger("Request received", "info");
  res.send(process.env.DB_PORT);
});

const PORT = process.env.BACKEND_PORT;
(async () => {
  try {
    await app.listen(PORT);
    logger(`Backend listening at port ${PORT}`, "success");
  } catch (error) {
    logger("Error occured while backend starts", "error");
    console.log(error);
  }
})();
