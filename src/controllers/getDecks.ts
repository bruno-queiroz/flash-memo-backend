import { Request, Response } from "express";
import { prisma } from "../app";
import { Prisma } from "@prisma/client";
import { getCardsExpired } from "../utils/getCardsExpired";
import { countCardAmountGroups } from "../utils/countCardAmountGroups";

export interface BodyRequest {
  userName: string;
  userId: string;
}

export const getDecks = async (req: Request, res: Response) => {
  const userData: BodyRequest = req.body;

  try {
    const decks = await prisma.user.findUnique({
      where: { id: userData.userId },
      select: {
        deck: {
          include: {
            cards: true,
          },
        },
      },
    });

    const decksWithStatus = decks?.deck?.map((deck) => ({
      ...deck,
      cards: countCardAmountGroups(deck?.cards?.filter(getCardsExpired)),
    }));
    res.json({
      isOk: true,
      msg: "Queried Successfully",
      data: decksWithStatus,
    });
  } catch (err) {
    res.json({ isOk: false, msg: "Something went wrong", data: null });
  }
};
