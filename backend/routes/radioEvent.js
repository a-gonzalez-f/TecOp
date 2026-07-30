import express from "express";
import { createRadioEvent, getRadioEvents } from "../controllers/radioEvent.js";

const router = express.Router();

router.post("/", createRadioEvent);
router.get("/", getRadioEvents);

export default router;
