import { Card, Prisma } from "@prisma/client";

export const getCardsExpired = (card: Card) => {
  if (!card.reviewAt) {
    return card;
  }
  if (new Date(card.reviewAt).getTime() <= new Date().getTime()) {
    return card;
  }
};
