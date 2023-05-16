import { Request, Response } from "express";
import { prisma } from "../app";
import { Prisma } from "@prisma/client";
import { getCardsExpired } from "../utils/getCardsExpired";
import { countCardAmountGroups } from "../utils/countCardAmountGroups";
import { BodyRequest } from "./getDecks";

export const studyDeck = async (req: Request, res: Response) => {
  const userData: BodyRequest = req.body;
  const { deckName } = req.params;
  try {
    const deck = await prisma.deck.findUnique({
      where: { name: deckName },
      include: {
        cards: true,
      },
    });

    res.json({ isOk: true, msg: "Cards Found", data: deck });
  } catch (err) {
    console.log(err);
    res.json({ isOk: false, msg: "Something went wrong", data: null });
  }
};
