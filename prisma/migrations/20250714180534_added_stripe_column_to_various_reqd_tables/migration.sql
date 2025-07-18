/*
  Warnings:

  - A unique constraint covering the columns `[stripeId]` on the table `pricing_tiers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeId]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pricing_tiers" ADD COLUMN     "stripeId" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "stripeId" TEXT;

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "stripeSubscriptionId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "stripeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pricing_tiers_stripeId_key" ON "pricing_tiers"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "products_stripeId_key" ON "products"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeId_key" ON "users"("stripeId");
