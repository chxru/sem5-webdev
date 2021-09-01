import express from "express";
import cors from "cors";
import { logger } from "./util/logger";

// routes
import authroutes from "./routes/auth";
import patientroutes from "./routes/patient";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));
// app.use(verifyToken);

app.use("/auth", authroutes);
app.use("/patient", patientroutes);

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
    logger(`Could not start server. ${error.message}`, "error");
    console.error(error.message);
  }
})();
