import express from "express";
import { signup, login, checkEmail } from "../controllers/user.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/check-email/:email", checkEmail);

export default router;
