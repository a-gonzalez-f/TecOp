import express from "express";

import auth from "../middleware/auth.js";
import adminOnly from "../middleware/adminOnly.js";

import {
  authorizeUser,
  getAuthorizedUsers,
  toggleUser,
  resetPassword,
  updateRole,
} from "../controllers/admin.js";

const router = express.Router();

// crear usuario autorizado
router.post("/authorize", auth, adminOnly, authorizeUser);

// listar usuarios
router.get("/users", auth, adminOnly, getAuthorizedUsers);

// toggle habilitacion usuario
router.patch("/users/:id/toggle", auth, adminOnly, toggleUser);

// reset contraseña
router.patch("/users/:id/reset-password", auth, adminOnly, resetPassword);

// update role
router.patch("/users/:id/role", auth, adminOnly, updateRole);

export default router;
