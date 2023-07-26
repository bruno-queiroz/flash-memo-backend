import { Request, Response } from "express";
import { prisma } from "../app";
import { getCardsExpired } from "../utils/getCardsExpired";

export const studyDeck = async (req: Request, res: Response) => {
  const { deckName } = req.params;
  try {
    const deck = await prisma.deck.findFirstOrThrow({
      where: { name: deckName },
      include: {
        cards: true,
      },
    });

    const expiredCards = deck?.cards.filter(getCardsExpired);
    res.json({ isOk: true, msg: "Cards Found", data: expiredCards });
  } catch (err) {
    res.json({ isOk: false, msg: "Something went wrong", data: null });
  }
};
