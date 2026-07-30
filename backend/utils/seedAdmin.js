import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: "admin@emova.com.ar" });

  if (!existing) {
    await User.create({
      email: "admin@emova.com.ar",
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
