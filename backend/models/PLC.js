import mongoose from "mongoose";

const PLCSchema = new mongoose.Schema(
  {
    // Identificación
    nombre: { type: String, required: true },
    linea: { type: String, required: true },
    descripcion: { type: String },
    estacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estaciones",
      index: true,
    },
    ubicacion: { type: String, default: "" },
    sector: { type: String, default: "" },

    // Conexión
    ip: { type: String, required: true, unique: true },
    puerto: { type: Number, default: 502 },
    slaveId: { type: Number, default: 1 },
    driver: {
      type: String,
      default: "modbus",
      enum: ["modbus"],
    },
    enabled: { type: Boolean, default: true },

    // Configuración Modbus
    holdingRegistersConfig: {
      start: { type: Number, default: 0 },
      length: { type: Number, default: 5 },
    },

    // Estado actual
    online: { type: Boolean, default: false },
    lastRead: { type: Date, default: null },
    lastStatusChange: { type: Date, default: null },
    latency: { type: Number, default: null },
    holdingRegisters: {
      type: [Number],
      default: [],
    },
    lastError: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("PLC", PLCSchema);
