/*
  Warnings:

  - Added the required column `delevryPrice` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payments` ADD COLUMN `delevryPrice` DECIMAL(4, 2) NOT NULL;
