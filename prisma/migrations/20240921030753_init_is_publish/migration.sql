-- AlterTable
ALTER TABLE `payments` ADD COLUMN `type` ENUM('local', 'distance') NOT NULL DEFAULT 'local';
