-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `imageFile` VARCHAR(191) NULL,
    `role` ENUM('admin', 'responsable', 'livreur') NOT NULL DEFAULT 'responsable',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `imageFile` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categories_name_key`(`name`),
    UNIQUE INDEX `categories_color_key`(`color`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `isPublish` BOOLEAN NOT NULL DEFAULT true,
    `type` ENUM('charbon', 'panini', 'four') NULL,
    `categoryId` INTEGER NULL,
    `imageFile` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `products_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `details` JSON NOT NULL,
    `totalePrice` DECIMAL(9, 2) NOT NULL,
    `isPayed` BOOLEAN NOT NULL DEFAULT true,
    `clientPhoneNumber` VARCHAR(191) NULL,
    `delevryId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('encoure de préparée', 'ramacé', 'livrée', 'refusé') NOT NULL DEFAULT 'encoure de préparée',
    `paymentId` INTEGER NULL,
    `paymentOfferId` INTEGER NULL,
    `isAccepted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orders_paymentId_key`(`paymentId`),
    UNIQUE INDEX `orders_paymentOfferId_key`(`paymentOfferId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_offer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalePrice` DECIMAL(9, 2) NOT NULL,
    `isPayed` BOOLEAN NOT NULL DEFAULT true,
    `details` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DECIMAL(9, 2) NOT NULL,
    `isPublish` BOOLEAN NOT NULL DEFAULT true,
    `imageFile` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `days` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `stopeAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PaymentToProduct` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PaymentToProduct_AB_unique`(`A`, `B`),
    INDEX `_PaymentToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_OfferToProduct` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_OfferToProduct_AB_unique`(`A`, `B`),
    INDEX `_OfferToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_OfferToPaymentOffer` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_OfferToPaymentOffer_AB_unique`(`A`, `B`),
    INDEX `_OfferToPaymentOffer_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_delevryId_fkey` FOREIGN KEY (`delevryId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_paymentOfferId_fkey` FOREIGN KEY (`paymentOfferId`) REFERENCES `payment_offer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PaymentToProduct` ADD CONSTRAINT `_PaymentToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `payments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PaymentToProduct` ADD CONSTRAINT `_PaymentToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OfferToProduct` ADD CONSTRAINT `_OfferToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `offers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OfferToProduct` ADD CONSTRAINT `_OfferToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OfferToPaymentOffer` ADD CONSTRAINT `_OfferToPaymentOffer_A_fkey` FOREIGN KEY (`A`) REFERENCES `offers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OfferToPaymentOffer` ADD CONSTRAINT `_OfferToPaymentOffer_B_fkey` FOREIGN KEY (`B`) REFERENCES `payment_offer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
