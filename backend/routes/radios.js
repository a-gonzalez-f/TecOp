import express from "express";
import {
  getRadios,
  createRadio,
  updateRadio,
  deleteRadio,
} from "../controllers/radios.js";

const router = express.Router();

router.get("/", getRadios);
router.post("/", createRadio);
router.put("/:id", updateRadio);
router.delete("/:id", deleteRadio);

export default router;
