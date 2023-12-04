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
    const cardEdited = await prisma.card.update({
      where: { id: cardId },
      data: newCardContent,
    });

    res.status(200).json({ isOk: true, msg: "Card edited", data: cardEdited });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(400).json({
          isOk: false,
          msg: "You already have this card",
          data: null,
        });
      }
      return;
    }
    res.status(500).json({
      isOk: false,
      msg: "Something went wrong editing the card",
      data: null,
    });
  }
};
