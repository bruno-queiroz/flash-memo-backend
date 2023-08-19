import { Request, Response } from "express";
import { prisma } from "../app";
import { Prisma } from "@prisma/client";

interface CardBodyRequest {
  deckId: string;
  front: string;
  back: string;
}

export const createCard = async (req: Request, res: Response) => {
  const newCardData: CardBodyRequest = req.body;

  try {
    await prisma.card.create({
      data: {
        front: newCardData?.front,
        back: newCardData?.back,
        deckId: newCardData?.deckId,
      },
    });

    res.json({ isOk: true, msg: "Card Created", data: null });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.json({
          isOk: false,
          msg: "You already have this card",
          data: null,
        });
      }
    } else {
      res.json({ isOk: false, msg: "Something went wrong", data: null });
    }
  }
};
