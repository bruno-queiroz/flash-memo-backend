/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Deck` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Deck_userId_name_key" ON "Deck"("userId", "name");
