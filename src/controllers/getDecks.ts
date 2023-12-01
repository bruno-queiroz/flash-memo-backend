import { Request, Response } from "express";
import prisma from "../../lib/client";
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
                OR: [
                  {
                    reviewAt: {
                      lte: new Date(),
                    },
                  },
                  {
                    reviewAt: {
                      equals: null,
                    },
                  },
                ],
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

    res.status(200).json({
      isOk: true,
      msg: "Queried Successfully",
      data: decksWithStatus,
    });
  } catch (err) {
    res
      .status(500)
      .json({ isOk: false, msg: "Something went wrong", data: null });
  }
};
