import { Request, Response } from "express";
import { createFlagService } from "../../core/services/flag.service.js";

export const createFlagController = async (req: Request, res: Response) => {
  try {
    const result = await createFlagService(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
