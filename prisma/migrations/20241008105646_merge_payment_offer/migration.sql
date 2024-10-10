/*
  Warnings:

  - You are about to drop the `_offertopaymentoffer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_offer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_offertopaymentoffer` DROP FOREIGN KEY `_OfferToPaymentOffer_A_fkey`;

-- DropForeignKey
ALTER TABLE `_offertopaymentoffer` DROP FOREIGN KEY `_OfferToPaymentOffer_B_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_paymentOfferId_fkey`;

-- DropTable
DROP TABLE `_offertopaymentoffer`;

-- DropTable
DROP TABLE `payment_offer`;

-- CreateTable
CREATE TABLE `_OfferToPayment` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_OfferToPayment_AB_unique`(`A`, `B`),
    INDEX `_OfferToPayment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_OfferToPayment` ADD CONSTRAINT `_OfferToPayment_A_fkey` FOREIGN KEY (`A`) REFERENCES `offers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OfferToPayment` ADD CONSTRAINT `_OfferToPayment_B_fkey` FOREIGN KEY (`B`) REFERENCES `payments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
