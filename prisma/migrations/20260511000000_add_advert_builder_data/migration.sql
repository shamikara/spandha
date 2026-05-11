-- AlterTable
ALTER TABLE `adverts`
    ADD COLUMN `builderData` JSON NULL,
    MODIFY `title` VARCHAR(100) NOT NULL,
    MODIFY `content` TEXT NOT NULL;
