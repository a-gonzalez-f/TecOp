import express from "express";

import {
  getEstaciones,
  getEstacionById,
  createEstacion,
  updateEstacion,
  deleteEstacion,
} from "../controllers/estaciones.js";

const router = express.Router();

router.get("/", getEstaciones);
router.get("/:id", getEstacionById);
router.post("/", createEstacion);
router.put("/:id", updateEstacion);
router.delete("/:id", deleteEstacion);

export default router;
