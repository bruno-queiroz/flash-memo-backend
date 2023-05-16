import { Card } from "@prisma/client";

export const countCardAmountGroups = (cards: Card[]) => {
  let resetedCards = 0;
  let newCards = 0;
  let reviewCards = 0;

  cards.forEach((card) => {
    if (card.wasCardReseted && card.reviewAwaitTime === 0) {
      resetedCards++;
    } else if (!card.wasCardReseted && card.reviewAwaitTime === 0) {
      newCards++;
    } else {
      reviewCards++;
    }
  });

  return {
    resetedCards,
    newCards,
    reviewCards,
  };
};
