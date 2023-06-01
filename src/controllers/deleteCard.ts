import { Request, Response } from "express";
import { prisma } from "../app";

export const deleteCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  try {
    await prisma.card.delete({
      where: { id: cardId },
    });

    res.json({ isOk: true, msg: "Card deleted", data: null });
  } catch (err) {
    console.log(err);
    res.json({ isOk: false, msg: "Failed to delete card", data: null });
  }
};
