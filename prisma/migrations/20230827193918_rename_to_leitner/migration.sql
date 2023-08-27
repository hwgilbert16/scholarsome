/*
  Warnings:

  - You are about to drop the `LearningCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LongTermLearning` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `LearningCard`;

-- DropTable
DROP TABLE `LongTermLearning`;

-- CreateTable
CREATE TABLE `LeitnerSet` (
    `id` VARCHAR(191) NOT NULL,
    `setId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LeitnerSet_setId_idx`(`setId`),
    INDEX `LeitnerSet_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeitnerCard` (
    `id` VARCHAR(191) NOT NULL,
    `leitnerSetId` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL,
    `box` INTEGER NOT NULL DEFAULT 1,
    `learnt` BOOLEAN NOT NULL DEFAULT false,
    `due` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `term` TEXT NOT NULL,
    `definition` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LeitnerCard_leitnerSetId_idx`(`leitnerSetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
