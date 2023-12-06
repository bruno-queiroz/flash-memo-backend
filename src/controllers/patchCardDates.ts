import { Request, Response } from "express";
import prisma from "../../lib/client";

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
    res.status(200).json({
      isOk: true,
      msg: "Card dates Patched successfully",
      data: null,
    });
  } catch (err) {
    console.error("Error patching card dates", err);
    res
      .status(500)
      .json({ isOk: false, msg: "Failed to patch dates", data: null });
  }
};
