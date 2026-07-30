import mongoose from "mongoose";

const RadioSchema = new mongoose.Schema(
  {
    tipo: { type: String, required: true },
    modelo: { type: String, required: true },

    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    alias: { type: String },
    nserie: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    linea: { type: String },
    ubicacion: { type: String },

    operativo: { type: Boolean, default: true },

    modeloTren: { type: String },
    formacion: { type: String },
    cabina: { type: String },

    responsable: { type: String },
    sector: { type: String },

    fuente: { type: Boolean, default: true },
    microfono: { type: Boolean, default: true },
    antena: { type: Boolean, default: true },
    parlante: { type: Boolean, default: true },

    liberado: { type: Boolean, default: false },
    instalado: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Radio", RadioSchema);
