import mongoose from "mongoose";

const RadioEventSchema = new mongoose.Schema(
  {
    radioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Radio",
      required: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["STATE_CHANGE", "MANUAL"],
    },

    // automáticos
    field: String,
    prevValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,

    // manuales
    tipoEvento: String,
    fecha: Date,
    descripcion: String,
    formacion: String,
    cabina: String,

    cambios: {
      fuente: Boolean,
      microfono: Boolean,
      antena: Boolean,
      parlante: Boolean,
    },

    createdBy: {
      type: String,
      default: "system",
    },
  },
  { timestamps: true },
);

export default mongoose.model("RadioEvent", RadioEventSchema);
