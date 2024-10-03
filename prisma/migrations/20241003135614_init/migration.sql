-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('normal', 'offre');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('encoure de préparée', 'ramacé', 'livrée', 'refusé');

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
    "imageFile" TEXT,
    "role" "userRole" NOT NULL DEFAULT 'responsable',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "imageFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
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
    "totalPrice" DECIMAL(9,2) NOT NULL,
    "isPayed" BOOLEAN NOT NULL DEFAULT true,
    "isLocal" BOOLEAN NOT NULL DEFAULT true,
    "type" "PaymentType" NOT NULL DEFAULT 'normal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'encoure de préparée',
    "clientPhoneNumber" TEXT NOT NULL,
    "delevryPhoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "delevryId" INTEGER,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "days" (
    "id" SERIAL NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stopeAt" TIMESTAMP(3),

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" SERIAL NOT NULL,
    "price" DECIMAL(9,2) NOT NULL,
    "imageFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_color_key" ON "Category"("color");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "orders_paymentId_key" ON "orders"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "_PaymentToProduct_AB_unique" ON "_PaymentToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_PaymentToProduct_B_index" ON "_PaymentToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OfferToProduct_AB_unique" ON "_OfferToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OfferToProduct_B_index" ON "_OfferToProduct"("B");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
