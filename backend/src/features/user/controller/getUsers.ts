import type { Request, Response } from "express";
import { getUsers } from "../service/user.service";

export async function getUsersController(_req: Request, res: Response) {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error("[getUsersController]", error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
}
