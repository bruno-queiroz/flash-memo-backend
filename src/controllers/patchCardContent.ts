import { Request, Response } from "express";
import prisma from "../../lib/client";
import { Prisma } from "@prisma/client";

interface BodyRequest {
  front: string;
  back: string;
  userName: string;
  userId: string;
}

export const patchCardContent = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { front, back }: BodyRequest = req.body;

  const newCardContent = { front, back };
  try {
    await prisma.card.update({
      where: { id: cardId },
      data: newCardContent,
    });

    res.json({ isOk: true, msg: "Card edited", data: null });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.json({
          isOk: false,
          msg: "You already have this card",
          data: null,
        });
      }
      return;
    }
    res.json({
      isOk: false,
      msg: "Something went wrong editting the card",
      data: null,
    });
  }
};
