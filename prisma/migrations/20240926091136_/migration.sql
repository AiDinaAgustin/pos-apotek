-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'KASIR', 'STAFF');

-- CreateEnum
CREATE TYPE "unit" AS ENUM ('pil', 'kapsul', 'tablet', 'sirup', 'salep', 'gel', 'injeksi');

-- CreateEnum
CREATE TYPE "order" AS ENUM ('on_process', 'success', 'rejected');

-- CreateEnum
CREATE TYPE "stock_transaction" AS ENUM ('initial_stock', 'receipt', 'sales');

-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "role" NOT NULL,
    "outlet_id" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outlets" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" TEXT NOT NULL,
    "phone" VARCHAR(18) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outlets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "unit" "unit" NOT NULL,
    "stock" INTEGER NOT NULL,
    "outlet_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" VARCHAR(255) NOT NULL,
    "outlet_id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "total_payment" INTEGER NOT NULL DEFAULT 0,
    "status" "order" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);


-- createOrderIdSequence
CREATE SEQUENCE order_id_seq
START 1
INCREMENT BY 1;

-- CreateTable
CREATE TABLE "order_details" (
    "id" VARCHAR(255) NOT NULL,
    "order_id" VARCHAR(255) NOT NULL,
    "item_id" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_cards" (
    "id" VARCHAR(255) NOT NULL,
    "item_id" VARCHAR(255) NOT NULL,
    "outlet_id" VARCHAR(255) NOT NULL,
    "stock_in" INTEGER NOT NULL,
    "stock_out" INTEGER NOT NULL,
    "current_stock" INTEGER NOT NULL,
    "transaction_type" "stock_transaction" NOT NULL,
    "transaction_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_receptions" (
    "id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "outlet_id" VARCHAR(255) NOT NULL,
    "kode_po" VARCHAR(255) NOT NULL,
    "date_po" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_receptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_reception_details" (
    "id" VARCHAR(255) NOT NULL,
    "item_id" VARCHAR(255) NOT NULL,
    "receptions_id" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_reception_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "item_receptions_kode_po_key" ON "item_receptions"("kode_po");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_cards" ADD CONSTRAINT "stock_cards_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_cards" ADD CONSTRAINT "stock_cards_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_receptions" ADD CONSTRAINT "item_receptions_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_receptions" ADD CONSTRAINT "item_receptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_reception_details" ADD CONSTRAINT "item_reception_details_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_reception_details" ADD CONSTRAINT "item_reception_details_receptions_id_fkey" FOREIGN KEY ("receptions_id") REFERENCES "item_receptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
