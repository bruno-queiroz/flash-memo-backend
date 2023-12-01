import { Request, Response } from "express";
import prisma from "../../lib/client";

export const getSingleCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    res.status(200).json({ isOk: true, msg: "Card found", data: card });
  } catch (err) {
    console.error("Error getting card", err);
    res.status(500).json({ isOk: false, msg: "Card not found", data: null });
  }
};
