/*
  Warnings:

  - You are about to drop the `LearnedLeitnerCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `LearnedLeitnerCard`;

-- CreateTable
CREATE TABLE `StudySessionCardInfo` (
    `id` VARCHAR(191) NOT NULL,
    `leitnerCardId` VARCHAR(191) NOT NULL,
    `studySessionLearnedId` VARCHAR(191) NULL,
    `studySessionUnlearnedId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `StudySessionCardInfo_leitnerCardId_studySessionLearnedId_stu_idx`(`leitnerCardId`, `studySessionLearnedId`, `studySessionUnlearnedId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
