/*
  Warnings:

  - The values [quarterly,annual] on the enum `RenewalPlan` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `shipmentSchedule` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `renewalPlan` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `shippingAddressId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Made the column `maxSubscribers` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `chosenPlan` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RenewalPlan_new" AS ENUM ('monthly', 'biweekly', 'weekly');
ALTER TABLE "subscriptions" ALTER COLUMN "renewalPlan" DROP DEFAULT;
ALTER TABLE "products" ALTER COLUMN "availablePlans" TYPE "RenewalPlan_new"[] USING ("availablePlans"::text::"RenewalPlan_new"[]);
ALTER TABLE "pricing_tiers" ALTER COLUMN "plan" TYPE "RenewalPlan_new" USING ("plan"::text::"RenewalPlan_new");
ALTER TABLE "subscriptions" ALTER COLUMN "chosenPlan" TYPE "RenewalPlan_new" USING ("chosenPlan"::text::"RenewalPlan_new");
ALTER TYPE "RenewalPlan" RENAME TO "RenewalPlan_old";
ALTER TYPE "RenewalPlan_new" RENAME TO "RenewalPlan";
DROP TYPE "RenewalPlan_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'pending';
ALTER TYPE "Status" ADD VALUE 'payment_failed';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "shippingAddressId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "price",
DROP COLUMN "shipmentSchedule",
ADD COLUMN     "availablePlans" "RenewalPlan"[],
ALTER COLUMN "maxSubscribers" SET NOT NULL;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "renewalPlan",
ADD COLUMN     "chosenPlan" "RenewalPlan" NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "pricing_tiers" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "plan" "RenewalPlan" NOT NULL,
    "minQuantity" INTEGER NOT NULL,
    "maxQuantity" INTEGER,
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pricing_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pricing_tiers_productId_plan_minQuantity_key" ON "pricing_tiers"("productId", "plan", "minQuantity");

-- AddForeignKey
ALTER TABLE "pricing_tiers" ADD CONSTRAINT "pricing_tiers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "shipping_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
