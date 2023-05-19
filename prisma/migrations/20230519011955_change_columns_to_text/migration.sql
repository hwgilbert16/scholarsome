-- AlterTable
ALTER TABLE `Card` MODIFY `term` TEXT NOT NULL,
    MODIFY `definition` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Set` MODIFY `description` TEXT NULL;
