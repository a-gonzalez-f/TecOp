import mongoose from "mongoose";

const EstacionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  linea: { type: String, required: true },
});

export default mongoose.model("Estaciones", EstacionSchema);
