/*
  Warnings:

  - You are about to drop the `SetMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `SetMedia`;

-- CreateTable
CREATE TABLE `CardMedia` (
    `id` VARCHAR(191) NOT NULL,
    `cardId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CardMedia_cardId_idx`(`cardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
