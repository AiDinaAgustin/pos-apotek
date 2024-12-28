-- CreateEnum
CREATE TYPE "request_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "item_requests" (
    "id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "outlet_id" VARCHAR(255) NOT NULL,
    "status" "request_status" NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL,
    "approved_at" TIMESTAMP(3),
    "notes" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_request_details" (
    "id" VARCHAR(255) NOT NULL,
    "request_id" VARCHAR(255) NOT NULL,
    "item_id" VARCHAR(255) NOT NULL,
    "qty" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_request_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item_requests" ADD CONSTRAINT "item_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_requests" ADD CONSTRAINT "item_requests_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_request_details" ADD CONSTRAINT "item_request_details_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "item_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_request_details" ADD CONSTRAINT "item_request_details_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
