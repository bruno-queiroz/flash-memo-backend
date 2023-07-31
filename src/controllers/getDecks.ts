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
    const decksAndCardsReadyToReview = await prisma.user.findUnique({
      where: { id: userData.userId },
      select: {
        deck: {
          include: {
            cards: {
              where: {
                reviewAt: {
                  lte: new Date(),
                },
              },
            },
          },
        },
      },
    });

    const decksWithStatus = decksAndCardsReadyToReview?.deck?.map((deck) => ({
      ...deck,
      cards: countCardAmountGroups(deck?.cards),
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
