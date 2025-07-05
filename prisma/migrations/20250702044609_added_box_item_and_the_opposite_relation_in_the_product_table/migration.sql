-- CreateTable
CREATE TABLE "box_items" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "box_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "box_items" ADD CONSTRAINT "box_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
