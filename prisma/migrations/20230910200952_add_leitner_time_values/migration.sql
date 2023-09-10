/*
  Warnings:

  - You are about to drop the column `learnt` on the `LeitnerCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `LeitnerCard` DROP COLUMN `learnt`,
    ADD COLUMN `lastSeenAt` DATETIME(3) NOT NULL DEFAULT '1970-01-01T00:00:01+00:00';

-- AlterTable
ALTER TABLE `LeitnerSet` ADD COLUMN `sessionStartedAt` DATETIME(3) NOT NULL DEFAULT '1970-01-01T00:00:01+00:00';
