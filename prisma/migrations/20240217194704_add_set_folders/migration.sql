-- DropIndex
DROP INDEX `Set_authorId_idx` ON `Set`;

-- AlterTable
ALTER TABLE `Set` ADD COLUMN `folderId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Folder` (
    `id` VARCHAR(191) NOT NULL,
    `parentFolderId` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `color` VARCHAR(7) NOT NULL,
    `private` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Folder_parentFolderId_authorId_idx`(`parentFolderId`, `authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FolderToSet` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FolderToSet_AB_unique`(`A`, `B`),
    INDEX `_FolderToSet_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Set_authorId_folderId_idx` ON `Set`(`authorId`, `folderId`);
