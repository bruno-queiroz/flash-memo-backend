import { Request, Response } from "express";
import { prisma } from "../app";

export const studyDeck = async (req: Request, res: Response) => {
  const { deckName } = req.params;
  try {
    const deck = await prisma.deck.findFirstOrThrow({
      where: { name: deckName, userId: req.body.userId },
      include: {
        cards: {
          where: {
            OR: [
              {
                reviewAt: {
                  lte: new Date(),
                },
              },
              {
                reviewAt: {
                  equals: null,
                },
              },
            ],
          },
        },
      },
    });

    res.json({
      isOk: true,
      msg: "Cards Found",
      data: deck?.cards,
    });
  } catch (err) {
    res.json({ isOk: false, msg: "Something went wrong", data: null });
  }
};
