import { Request, Response } from "express";
import { createFlagService,
         getAllFlagsService,
         getFlagByKeyService,
         evaluateFlagService,
         updateFlagService,
         deleteFlagService
 } from "../../core/services/flag.service.js";
 import { PatchFlagSchema } from "../validators/flag.patch.validator.js";
 import { CreateFlagSchema } from "../validators/flag.validator.js";


export const createFlagController = async (req: Request, res: Response) => {
  try {
    const parsed = CreateFlagSchema.parse(req.body);

    const result = await createFlagService(parsed);

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


export const updateFlagController = async (req: Request, res: Response) => {
  try {
    if ("key" in req.body) {
      return res.status(400).json({
        error: "Feature flag key is immutable"
      });
    }

    const update = PatchFlagSchema.parse(req.body);

    const result = await updateFlagService(
      req.params.key,
      update
    );

    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


export const deleteFlagController = async (req: Request, res: Response) => {
  try {
    const result = await deleteFlagService(req.params.key);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


export const getAllFlagsController = async (req: Request, res: Response) => {
  try {
    const result = await getAllFlagsService();
    res.status(200).json(result);
  } catch(err: any) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};


export const getFlagByKeyController = async (req: Request, res: Response) => {
  try {
    const result = await getFlagByKeyService(req.params.key);
     if (!result) {
      return res.status(404).json({ error: "Feature flag not found" });
    }
    res.status(200).json(result);
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};


export const evaluateFlagController = async (req: Request, res: Response) => {
  try {
    const { key, environment, context } = req.body;

    if (!key || !context) {
      return res.status(400).json({
        error: "key and context are required"
      });
    }

    const result = await evaluateFlagService(
      key,
      context,
      environment
    );

    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};