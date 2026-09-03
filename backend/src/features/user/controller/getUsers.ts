import type { Request, Response } from "express";
import { getUsers } from "../service/user.service";
import { logger } from "../../../lib/logger";

export async function getUsersController(_req: Request, res: Response) {
  logger.info("user.list.fetch");
  try {
    const users = await getUsers();
    logger.info("user.list.success", { count: users.length });
    res.json(users);
  } catch (error) {
    logger.error("user.list.error", {}, error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
}
