import mongoose from "mongoose";

const InternoSchema = new mongoose.Schema({
  LINEA: { type: String },
  REF1: { type: String },
  REF2: { type: String },
  INTERNO: { type: Number },
});

export default mongoose.model("Interno", InternoSchema);
