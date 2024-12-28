/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "orders_public_id_key" ON "orders"("public_id");
