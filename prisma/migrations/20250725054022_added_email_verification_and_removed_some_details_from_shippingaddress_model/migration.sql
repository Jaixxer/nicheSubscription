/*
  Warnings:

  - You are about to drop the column `address2` on the `shipping_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `shipping_addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shipping_addresses" DROP COLUMN "address2",
DROP COLUMN "country";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;
