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


export const getAllFlagsService = async () => {
    const flags = await FlagModel.find({});
    return {
        success: true,
        count: flags.length,
        flags
    };
};


export const getFlagByKeyService = async (key: string) => {
    const flag = await FlagModel.findOne({ key });

    // controller handles the null case
    return flag;
};