import type { Request, Response } from "express";
import { getUsers } from "../../user/service/user.service";
import { logger } from "../../../lib/logger";

export async function getUsersController(req: Request, res: Response) {
  const adminId = req.user?.userId;
  logger.info("admin.users.fetch", { adminId });
  try {
    const users = await getUsers();
    logger.info("admin.users.success", { adminId, count: users.length });
    res.json(users);
  } catch (error) {
    logger.error("admin.users.error", { adminId }, error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
}
