import { Request, Response } from "express";
import { prisma } from "../app";
import { Prisma } from "@prisma/client";

interface BodyRequest {
  deckName: string;
  userName: string;
  userId: string;
}

export const patchRenameDeck = async (req: Request, res: Response) => {
  const { deckId } = req.params;
  const { deckName }: BodyRequest = req.body;
  try {
    await prisma.deck.update({
      where: {
        id: deckId,
      },
      data: {
        name: deckName,
      },
    });

    res.json({ isOk: true, msg: "Deck Name Edited", data: null });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.json({
          isOk: false,
          msg: "You already have a Deck with this name",
          data: null,
        });
      }
      return;
    }

    res.json({ isOk: false, msg: "Failed to edit deck", data: null });
  }
};
