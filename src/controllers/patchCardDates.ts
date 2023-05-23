import { Request, Response } from "express";
import { prisma } from "../app";
import { Prisma } from "@prisma/client";
import { getCardsExpired } from "../utils/getCardsExpired";
import { countCardAmountGroups } from "../utils/countCardAmountGroups";

export interface BodyRequest {
  reviewAt: null | Date;
  reviewAwaitTime: number;
  wasCardReseted: boolean;
  userName: string;
  userId: string;
}

export const patchCardDates = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { wasCardReseted, reviewAwaitTime }: BodyRequest = req.body;
  try {
    await prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        reviewAt: new Date(new Date().getTime() + reviewAwaitTime),
        reviewAwaitTime,
        wasCardReseted,
      },
    });
    res.json({ isOk: true });
  } catch (err) {
    res.json({ isOk: false, msg: "patch dates" });
  }
};
