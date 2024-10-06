-- CreateEnum
CREATE TYPE "Ordertatus" AS ENUM ('encoure de préparée', 'ramacé', 'livrée', 'refusé');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('charbon', 'panini', 'four');

-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('admin', 'responsable', 'livreur');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "imageFile" TEXT,
    "role" "userRole" NOT NULL DEFAULT 'responsable',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "imageFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isPublish" BOOLEAN NOT NULL DEFAULT true,
    "type" "ProductType",
    "categoryId" INTEGER,
    "imageFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "details" JSONB NOT NULL,
    "totalePrice" DECIMAL(9,2) NOT NULL,
    "isPayed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "status" "Ordertatus" NOT NULL DEFAULT 'encoure de préparée',
    "clentName" TEXT NOT NULL,
    "clientPhoneNumber" TEXT NOT NULL,
    "delevryPhoneNumber" TEXT NOT NULL,
    "paymentId" INTEGER,
    "paymentOfferId" INTEGER,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "delevryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_offer" (
    "id" SERIAL NOT NULL,
    "totalePrice" DECIMAL(9,2) NOT NULL,
    "isPayed" BOOLEAN NOT NULL DEFAULT true,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(9,2) NOT NULL,
    "isPublish" BOOLEAN NOT NULL DEFAULT true,
    "imageFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "days" (
    "id" SERIAL NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stopeAt" TIMESTAMP(3),

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PaymentToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OfferToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OfferToPaymentOffer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_color_key" ON "categories"("color");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "orders_paymentId_key" ON "orders"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_paymentOfferId_key" ON "orders"("paymentOfferId");

-- CreateIndex
CREATE UNIQUE INDEX "_PaymentToProduct_AB_unique" ON "_PaymentToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_PaymentToProduct_B_index" ON "_PaymentToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OfferToProduct_AB_unique" ON "_OfferToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OfferToProduct_B_index" ON "_OfferToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OfferToPaymentOffer_AB_unique" ON "_OfferToPaymentOffer"("A", "B");

-- CreateIndex
CREATE INDEX "_OfferToPaymentOffer_B_index" ON "_OfferToPaymentOffer"("B");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_paymentOfferId_fkey" FOREIGN KEY ("paymentOfferId") REFERENCES "payment_offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delevryId_fkey" FOREIGN KEY ("delevryId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentToProduct" ADD CONSTRAINT "_PaymentToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentToProduct" ADD CONSTRAINT "_PaymentToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferToProduct" ADD CONSTRAINT "_OfferToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferToProduct" ADD CONSTRAINT "_OfferToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferToPaymentOffer" ADD CONSTRAINT "_OfferToPaymentOffer_A_fkey" FOREIGN KEY ("A") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferToPaymentOffer" ADD CONSTRAINT "_OfferToPaymentOffer_B_fkey" FOREIGN KEY ("B") REFERENCES "payment_offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
