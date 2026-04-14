import mongoose, { Schema, model, models } from "mongoose";

const InstitutionSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    walletAddress: { type: String, unique: true },
    ownerId: { type: String, required: true },
    members: [
      {
        userId: { type: String, required: true },
        role: { type: String, enum: ["owner", "admin", "viewer"], required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    accentColor: { type: String, default: "#f59e0b" },
    certPrefix: { type: String, default: "CERT" },
    verifiedDomain: { type: String }, // e.g. "thapar.edu"
    secretKeyHash: { type: String }, // Hashed API key
    usageStats: {
      monthlyApiCalls: { type: Number, default: 0 },
      lastApiCall: { type: Date },
    },
    settings: {
      paySchedule: { type: String },
      currency: { type: String },
    },
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Institution = models.Institution || model("Institution", InstitutionSchema);
export default Institution;
