import { Request, Response } from "express";
import prisma from "../../lib/client";

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

    res.status(200).json({
      isOk: true,
      msg: "Cards Found",
      data: deck?.cards,
    });
  } catch (err) {
    res
      .status(400)
      .json({ isOk: false, msg: "Something went wrong", data: null });
  }
};
