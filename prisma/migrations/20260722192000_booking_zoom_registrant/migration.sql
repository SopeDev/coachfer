-- AlterTable
ALTER TABLE "LiveSession" ALTER COLUMN "cancelDeadlineHours" SET DEFAULT 2;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "zoomRegistrantId" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "zoomJoinUrl" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "zoomRegistrantEmail" TEXT;
