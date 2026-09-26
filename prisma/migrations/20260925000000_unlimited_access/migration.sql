-- Scholarship / unlimited access: bypasses the credit system entirely.
ALTER TABLE "User" ADD COLUMN "hasUnlimitedAccess" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "unlimitedAccessUntil" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "unlimitedAccessReason" TEXT;

-- A booking made with unlimited access consumes no credit grant.
ALTER TABLE "Booking" ALTER COLUMN "creditGrantId" DROP NOT NULL;
