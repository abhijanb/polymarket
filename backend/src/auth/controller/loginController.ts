import type { Request, Response } from "express";

export async function loginController(req: Request, res: Response) {
  // Express 5 automatically catches rejected promises / thrown errors
  // No need for express-async-handler or try/catch -> next(err)
  // Example async work:
  // const user = await db.findUser(req.body.email);
  // if (!user) throw new Error("User not found"); // -> goes to errorHandler

  res.json({ message: "login ok" });
}