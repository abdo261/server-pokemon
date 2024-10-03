/*
  Warnings:

  - You are about to drop the column `image` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `category` DROP COLUMN `image`,
    ADD COLUMN `imageFile` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `image`,
    ADD COLUMN `imageFile` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `image`,
    ADD COLUMN `imageFile` VARCHAR(191) NULL;
