import { Request, Response } from "express";
import { prisma } from "../app";
import { Prisma } from "@prisma/client";

interface BodyRequest {
  userName: string;
  userId: string;
}

export const getDecks = async (req: Request, res: Response) => {
  const userData: BodyRequest = req.body;

  try {
    const decks = await prisma.user.findUnique({
      where: { id: userData.userId },
      select: {
        deck: true,
      },
    });
    res.json({ isOk: true, msg: "Queried Successfully", data: decks });
  } catch (err) {
    res.json({ isOk: false, msg: "Something went wrong", data: null });
  }
};
