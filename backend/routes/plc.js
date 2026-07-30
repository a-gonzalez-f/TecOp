import express from "express";
import { getPLCs, getPLC, updatePLC } from "../controllers/plc.js";

const router = express.Router();

router.get("/", getPLCs);

router.get("/:id", getPLC);

router.put("/:id", updatePLC);

export default router;
