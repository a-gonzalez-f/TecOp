import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const dominio = process.env.EMAIL_DOMAIN;

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: `admin@${dominio}` });

  if (!existing) {
    await User.create({
      email: `admin@${dominio}`,
      passwordHash: null,
      role: "admin",
      signupCompleted: false,
    });

    console.log("Admin creado");
  } else {
    console.log("Admin ya existe");
  }

  process.exit();
};

seedAdmin();
