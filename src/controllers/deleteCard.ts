import { Request, Response } from "express";
import prisma from "../../lib/client";

export const deleteCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  try {
    await prisma.card.delete({
      where: { id: cardId },
    });

    res.status(200).json({ isOk: true, msg: "Card deleted", data: null });
  } catch (err) {
    console.error("Error deleting card", err);
    res
      .status(500)
      .json({ isOk: false, msg: "Failed to delete card", data: null });
  }
};
