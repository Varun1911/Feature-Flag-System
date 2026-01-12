import mongoose from "mongoose";

const FlagVersionSchema = new mongoose.Schema(
  {
    flagKey: { type: String, required: true },
    version: { type: Number, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    createdBy: { type: String, required: true }
  },
  { timestamps: true }
);

export const FlagVersionModel =
  mongoose.model("FlagVersion", FlagVersionSchema);
