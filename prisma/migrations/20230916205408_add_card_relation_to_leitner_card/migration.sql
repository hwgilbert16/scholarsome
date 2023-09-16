/*
  Warnings:

  - You are about to drop the column `definition` on the `LeitnerCard` table. All the data in the column will be lost.
  - You are about to drop the column `index` on the `LeitnerCard` table. All the data in the column will be lost.
  - You are about to drop the column `term` on the `LeitnerCard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[leitnerSetId,cardId]` on the table `LeitnerCard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cardId` to the `LeitnerCard` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `LeitnerCard_leitnerSetId_index_key` ON `LeitnerCard`;

-- AlterTable
ALTER TABLE `LeitnerCard` DROP COLUMN `definition`,
    DROP COLUMN `index`,
    DROP COLUMN `term`,
    ADD COLUMN `cardId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `LeitnerCard_leitnerSetId_cardId_key` ON `LeitnerCard`(`leitnerSetId`, `cardId`);
