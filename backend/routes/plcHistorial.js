import express from "express";
import { getPLCHistory } from "../controllers/plcHistorial.js";

const router = express.Router();

router.get("/:plcId", getPLCHistory);

export default router;
