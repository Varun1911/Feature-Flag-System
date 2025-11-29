import { CreateFlagSchema } from "../../api/validators/flag.validator.js"
import { FlagModel } from "../models/flag.model.js";

export const createFlagService = async (data: any) => {
    //validation using zod
    const parsed = CreateFlagSchema.parse(data);

    //checking if already exists
    const exists = await FlagModel.exists({ key: parsed.key });
    if(exists){
        throw new Error(`Feature Flag "${parsed.key}" already exists`);
    }

    const createdFlag = await FlagModel.create(parsed);

    return {
        success: true,
        flag: createdFlag
    };
};