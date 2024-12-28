-- AddForeignKey
ALTER TABLE "item_receptions" ADD CONSTRAINT "item_receptions_kode_po_fkey" FOREIGN KEY ("kode_po") REFERENCES "item_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
