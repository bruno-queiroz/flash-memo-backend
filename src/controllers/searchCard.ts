import { Request, Response } from "express";
import prisma from "../../lib/client";

export const searchCard = async (req: Request, res: Response) => {
  const { cardQuery, deckId } = req.params;
  try {
    const cards = await prisma.deck.findUnique({
      where: { id: deckId },
      include: {
        cards: {
          where: {
            OR: [
              {
                front: { contains: cardQuery },
              },
              {
                back: { contains: cardQuery },
              },
            ],
          },
        },
      },
    });

    res.status(200).json({ isOk: true, msg: "Card found", data: cards });
  } catch (err) {
    console.error("Error finding card", err);
    res.status(400).json({ isOk: false, msg: "Card not found", data: null });
  }
};
