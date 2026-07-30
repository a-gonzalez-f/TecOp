import mongoose from "mongoose";

const PLCHistorySchema = new mongoose.Schema(
  {
    plc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PLC",
      required: true,
      index: true,
    },

    tipo: { type: String },

    online: {
      type: Boolean,
      required: true,
    },

    latency: {
      type: Number,
    },

    holdingRegisters: {
      type: [Number],
      default: [],
    },

    lastError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

PLCHistorySchema.index({ plc: 1, createdAt: -1 });

export default mongoose.model("PLCHistory", PLCHistorySchema);
