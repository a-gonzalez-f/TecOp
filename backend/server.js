import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("Server running");
});
