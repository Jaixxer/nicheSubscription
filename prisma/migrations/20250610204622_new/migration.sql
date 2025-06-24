/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "Curator" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Phone" INTEGER,
ADD COLUMN     "Subscriber" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "Roles";

-- CreateIndex
CREATE UNIQUE INDEX "users_Phone_key" ON "users"("Phone");
