-- AlterTable
ALTER TABLE `products` ADD COLUMN `type` ENUM('charbon', 'panini', 'four') NOT NULL DEFAULT 'panini';
