-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_setId_fkey`;
DROP INDEX `Card_setId_fkey` ON `Card`;

-- DropForeignKey
ALTER TABLE `Set` DROP FOREIGN KEY `Set_authorId_fkey`;
DROP INDEX `Set_authorId_fkey` ON `Set`;

-- RedefineIndex
CREATE INDEX `Card_setId_idx` ON `Card`(`setId`);

-- RedefineIndex
CREATE INDEX `Set_authorId_idx` ON `Set`(`authorId`);
