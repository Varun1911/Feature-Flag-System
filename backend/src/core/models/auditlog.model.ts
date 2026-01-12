import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    flagKey: { type: String, required: true },

    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "ROLLBACK"],
      required: true
    },

    environment: { type: String }, // "dev" | "prod" or null

    before: { type: mongoose.Schema.Types.Mixed },
    after: { type: mongoose.Schema.Types.Mixed },

    changedBy: { type: String, required: true }
  },
  { timestamps: true }
);

export const AuditLogModel =
  mongoose.model("AuditLog", AuditLogSchema);
