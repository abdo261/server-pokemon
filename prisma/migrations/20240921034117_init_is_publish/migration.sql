/*
  Warnings:

  - You are about to alter the column `type` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payments` ADD COLUMN `isLocal` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isPayed` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `type` ENUM('normal', 'offre') NOT NULL DEFAULT 'normal';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('admin', 'responsable', 'delevry') NOT NULL;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('encoure de préparée', 'ramacé', 'livrée', 'refusé') NOT NULL DEFAULT 'encoure de préparée',
    `clientPhoneNumber` VARCHAR(191) NOT NULL,
    `delevryPhoneNumber` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `paymentId` INTEGER NOT NULL,
    `isAccepted` BOOLEAN NOT NULL DEFAULT false,
    `delevryId` INTEGER NULL,

    UNIQUE INDEX `orders_paymentId_key`(`paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_delevryId_fkey` FOREIGN KEY (`delevryId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
