import { Request, Response } from "express";
import { createFlagService,
         getAllFlagsService,
         getFlagByKeyService
 } from "../../core/services/flag.service.js";

export const createFlagController = async (req: Request, res: Response) => {
  try {
    const result = await createFlagService(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    console.error(err);
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


