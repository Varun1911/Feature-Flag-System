import { Request, Response } from "express";
import { AuditLogModel } from "../../core/models/auditlog.model.js";

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await AuditLogModel
      .find({ flagKey: req.params.key })
      .sort({ createdAt: -1 })
      .lean();

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
};
