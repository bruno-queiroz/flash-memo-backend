import { Request, Response } from "express";
import prisma from "../../lib/client";
import { Prisma } from "@prisma/client";

interface DeckBodyRequest {
  deckName: string;
  password: string;
  userName: string;
  userId: string;
}

export const postDeck = async (req: Request, res: Response) => {
  const userNewDeckData: DeckBodyRequest = req.body;

  try {
    await prisma.deck.create({
      data: { name: userNewDeckData.deckName, userId: userNewDeckData.userId },
    });

    res.json({ isOk: true, msg: "Deck Created Successfully", data: null });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.json({
          isOk: false,
          msg: "You already have a deck with this name",
          data: null,
        });
      }
    } else {
      res.json({ isOk: false, msg: "Something went wrong", data: null });
    }
  }
};
