import express from "express";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { prisma } from "../../db/prisma";

export const authRouter = express.Router();

authRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      // 👉️ err is type Error here
      return res.status(500).json({ error: true, message: error.message });
    }
    res.status(500).json({ error });
  }
});

authRouter.post("/", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: "Daniel@gmail.com",
        name: "lezzgoo",
      },
    });
    res.status(201).json(user);
  } catch (error) {}
});
