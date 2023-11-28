import { Request, Response } from "express";
import prisma from "../../lib/client";
import { Prisma } from "@prisma/client";

interface CardBodyRequest {
  deckId: string;
  front: string;
  back: string;
}

export const createCard = async (req: Request, res: Response) => {
  const newCardData: CardBodyRequest = req.body;

  try {
    const card = await prisma.card.create({
      data: {
        front: newCardData?.front,
        back: newCardData?.back,
        deckId: newCardData?.deckId,
      },
    });

    res.status(201).json({ isOk: true, msg: "Card Created", data: card });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(400).json({
          isOk: false,
          msg: "You already have this card",
          data: null,
        });
      }
    } else {
      res
        .status(500)
        .json({ isOk: false, msg: "Something went wrong", data: null });
    }
  }
};
