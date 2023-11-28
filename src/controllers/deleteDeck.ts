import { Request, Response } from "express";
import prisma from "../../lib/client";

export const deleteDeck = async (req: Request, res: Response) => {
  const { deckId } = req.params;

  try {
    await prisma.card.deleteMany({
      where: {
        deckId,
      },
    });

    await prisma.deck.delete({
      where: {
        id: deckId,
      },
    });

    res.json({ isOk: true, msg: "Deck deleted", data: null });
  } catch (err) {
    res.json({ isOk: false, msg: "Failed to delete deck", data: null });
  }
};
