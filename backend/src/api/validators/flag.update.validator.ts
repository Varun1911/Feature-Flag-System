import { CreateFlagSchema } from "./flag.validator.js";

export const UpdateFlagSchema = CreateFlagSchema.omit({ key: true }).partial();

