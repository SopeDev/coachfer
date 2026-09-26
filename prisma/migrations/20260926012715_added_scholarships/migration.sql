-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_creditGrantId_fkey";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_creditGrantId_fkey" FOREIGN KEY ("creditGrantId") REFERENCES "CreditGrant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
