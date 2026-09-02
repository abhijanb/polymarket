/*
  Warnings:

  - You are about to drop the column `amount` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `trades` table. All the data in the column will be lost.
  - Added the required column `shares` to the `trades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "amount",
ADD COLUMN     "totalCostUsd" DECIMAL(14,6) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "trades" DROP COLUMN "amount",
ADD COLUMN     "shares" DECIMAL(14,6) NOT NULL,
ADD COLUMN     "totalCostUsd" DECIMAL(14,6) NOT NULL DEFAULT 0;
