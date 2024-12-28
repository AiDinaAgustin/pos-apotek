/*
  Warnings:

  - The values [sales] on the enum `stock_transaction` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "stock_transaction_new" AS ENUM ('initial_stock', 'receipt', 'sale');
ALTER TABLE "stock_cards" ALTER COLUMN "transaction_type" TYPE "stock_transaction_new" USING ("transaction_type"::text::"stock_transaction_new");
ALTER TYPE "stock_transaction" RENAME TO "stock_transaction_old";
ALTER TYPE "stock_transaction_new" RENAME TO "stock_transaction";
DROP TYPE "stock_transaction_old";
COMMIT;
