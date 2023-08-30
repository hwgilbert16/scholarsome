/*
  Warnings:

  - A unique constraint covering the columns `[leitnerSetId,index]` on the table `LeitnerCard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[setId,userId]` on the table `LeitnerSet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LeitnerCard_leitnerSetId_index_key` ON `LeitnerCard`(`leitnerSetId`, `index`);

-- CreateIndex
CREATE UNIQUE INDEX `LeitnerSet_setId_userId_key` ON `LeitnerSet`(`setId`, `userId`);
