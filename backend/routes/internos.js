import express from "express";
import {
  searchInternos,
  updateInterno,
  createInterno,
} from "../controllers/internos.js";

const router = express.Router();

router.get("/", searchInternos);

router.patch("/:id", updateInterno);

router.post("/", createInterno);

export default router;
