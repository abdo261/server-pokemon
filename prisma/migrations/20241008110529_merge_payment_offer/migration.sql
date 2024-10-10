/*
  Warnings:

  - You are about to drop the `_offertopayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_offertopayment` DROP FOREIGN KEY `_OfferToPayment_A_fkey`;

-- DropForeignKey
ALTER TABLE `_offertopayment` DROP FOREIGN KEY `_OfferToPayment_B_fkey`;

-- DropTable
DROP TABLE `_offertopayment`;

-- CreateTable
CREATE TABLE `payment_offer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `details` JSON NOT NULL,
    `isPayed` BOOLEAN NOT NULL DEFAULT true,
    `totalePrice` DECIMAL(9, 2) NOT NULL,
    `delevryPrice` DECIMAL(4, 2) NULL,
    `clientPhoneNumber` VARCHAR(191) NULL,
    `delevryId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_OfferToPaymentOffer` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_OfferToPaymentOffer_AB_unique`(`A`, `B`),
    INDEX `_OfferToPaymentOffer_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_paymentOfferId_fkey` FOREIGN KEY (`paymentOfferId`) REFERENCES `payment_offer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_offer` ADD CONSTRAINT `payment_offer_delevryId_fkey` FOREIGN KEY (`delevryId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OfferToPaymentOffer` ADD CONSTRAINT `_OfferToPaymentOffer_A_fkey` FOREIGN KEY (`A`) REFERENCES `offers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OfferToPaymentOffer` ADD CONSTRAINT `_OfferToPaymentOffer_B_fkey` FOREIGN KEY (`B`) REFERENCES `payment_offer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
