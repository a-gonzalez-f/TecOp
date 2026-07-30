import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import radiosRoutes from "./routes/radios.js";
import radioEventsRoutes from "./routes/radioEvent.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import internosRoutes from "./routes/internos.js";
import plcRoutes from "./routes/plc.js";
import estacionesRoutes from "./routes/estaciones.js";
import plcHistorialRoutes from "./routes/plcHistorial.js";

import { pollPLCs } from "./services/plcPollingService.js";

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/radios", radiosRoutes);
app.use("/api/radio-events", radioEventsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/internos", internosRoutes);
app.use("/api/plc", plcRoutes);
app.use("/api/estaciones", estacionesRoutes);
app.use("/api/plc-history", plcHistorialRoutes);

const POLLING_INTERVAL = Number(process.env.POLLING_INTERVAL) || 5000;

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("Server running");
  console.log(`Polling cada ${POLLING_INTERVAL}ms`);

  pollPLCs();
  setInterval(pollPLCs, POLLING_INTERVAL);
});
