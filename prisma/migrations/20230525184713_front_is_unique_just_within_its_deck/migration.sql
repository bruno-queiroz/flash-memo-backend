/*
  Warnings:

  - A unique constraint covering the columns `[deckId,front]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Card_front_key";

-- CreateIndex
CREATE UNIQUE INDEX "Card_deckId_front_key" ON "Card"("deckId", "front");
