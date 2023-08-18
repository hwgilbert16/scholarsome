/*
  Warnings:

  - You are about to drop the column `learningId` on the `LearningCard` table. All the data in the column will be lost.
  - You are about to drop the `Learning` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `longTermLearningId` to the `LearningCard` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `LearningCard_learningId_idx` ON `LearningCard`;

-- AlterTable
ALTER TABLE `LearningCard` DROP COLUMN `learningId`,
    ADD COLUMN `longTermLearningId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Learning`;

-- CreateTable
CREATE TABLE `LongTermLearning` (
    `id` VARCHAR(191) NOT NULL,
    `setId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LongTermLearning_setId_idx`(`setId`),
    INDEX `LongTermLearning_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `LearningCard_longTermLearningId_idx` ON `LearningCard`(`longTermLearningId`);
