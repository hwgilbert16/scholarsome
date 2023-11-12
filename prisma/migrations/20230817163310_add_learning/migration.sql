-- CreateTable
CREATE TABLE `Learning` (
    `id` VARCHAR(191) NOT NULL,
    `setId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Learning_setId_idx`(`setId`),
    INDEX `Learning_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LearningCard` (
    `id` VARCHAR(191) NOT NULL,
    `learningId` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL,
    `box` INTEGER NOT NULL,
    `learnt` BOOLEAN NOT NULL DEFAULT false,
    `due` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `term` TEXT NOT NULL,
    `definition` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LearningCard_learningId_idx`(`learningId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
