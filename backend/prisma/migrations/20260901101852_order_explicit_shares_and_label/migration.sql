/*
  Warnings:

  - You are about to alter the column `amount` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Decimal(14,6)`.
  - You are about to alter the column `filled` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Decimal(14,6)`.
  - You are about to alter the column `amount` on the `trades` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Decimal(14,6)`.
  - Added the required column `outcomeLabel` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerShareCents` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shares` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outcomeLabel` to the `trades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerShareCents` to the `trades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "outcomeLabel" TEXT NOT NULL,
ADD COLUMN     "pricePerShareCents" INTEGER NOT NULL,
ADD COLUMN     "shares" DECIMAL(14,6) NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(14,6),
ALTER COLUMN "filled" DROP DEFAULT,
ALTER COLUMN "filled" SET DATA TYPE DECIMAL(14,6);

-- AlterTable
ALTER TABLE "trades" ADD COLUMN     "outcomeLabel" TEXT NOT NULL,
ADD COLUMN     "pricePerShareCents" INTEGER NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(14,6);

-- CreateIndex
CREATE INDEX "orders_userId_createdAt_idx" ON "orders"("userId", "createdAt");
