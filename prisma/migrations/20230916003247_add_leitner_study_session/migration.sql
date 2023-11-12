/*
  Warnings:

  - You are about to drop the column `learnt` on the `LeitnerCard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[setId,index]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studySessionId]` on the table `LeitnerSet` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `LeitnerCard` DROP COLUMN `learnt`;

-- AlterTable
ALTER TABLE `LeitnerSet` ADD COLUMN `studySessionId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `StudySession` (
    `id` VARCHAR(191) NOT NULL,
    `leitnerSetId` VARCHAR(191) NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT '1970-01-01T00:00:01+00:00',

    UNIQUE INDEX `StudySession_leitnerSetId_key`(`leitnerSetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LearnedLeitnerCard` (
    `id` VARCHAR(191) NOT NULL,
    `leitnerCardId` VARCHAR(191) NOT NULL,
    `studySessionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LearnedLeitnerCard_leitnerCardId_studySessionId_idx`(`leitnerCardId`, `studySessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Card_setId_index_key` ON `Card`(`setId`, `index`);

-- CreateIndex
CREATE UNIQUE INDEX `LeitnerSet_studySessionId_key` ON `LeitnerSet`(`studySessionId`);
