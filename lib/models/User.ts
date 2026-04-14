import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["institution", "student"], required: true },
    linkedWallet: { type: String, unique: true, sparse: true }, // Stellar public key
    avatarColor: { type: String, default: "#f59e0b" },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    rememberMe: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    preferences: {
      emailOnCertIssued: { type: Boolean, default: true },
      emailOnVerification: { type: Boolean, default: false },
      securityAlerts: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
