import { Request, Response } from "express";
import prisma from "../../lib/client";
import { Prisma } from "@prisma/client";

interface DeckBodyRequest {
  deckName: string;
  userName: string;
  userId: string;
}

export const postDeck = async (req: Request, res: Response) => {
  const userNewDeckData: DeckBodyRequest = req.body;

  try {
    const deck = await prisma.deck.create({
      data: { name: userNewDeckData.deckName, userId: userNewDeckData.userId },
    });

    res
      .status(200)
      .json({ isOk: true, msg: "Deck Created Successfully", data: deck });
  } catch (err) {
    console.error("Error creating deck", err);
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      res.status(400).json({
        isOk: false,
        msg: "You already have a deck with this name",
        data: null,
      });
      return;
    }

    res
      .status(500)
      .json({ isOk: false, msg: "Something went wrong", data: null });
  }
};
