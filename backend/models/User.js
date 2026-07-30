import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      default: null,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin", "supervisor"],
      default: "user",
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    signupCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model("User", UserSchema);
