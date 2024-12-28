/*
  Warnings:

  - Added the required column `public_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "public_id" VARCHAR(255) NOT NULL;
