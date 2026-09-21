-- Drafts are no longer supported; remove any leftovers before shrinking the enum.
DELETE FROM "LiveSession" WHERE "status" = 'DRAFT';

-- AlterEnum
BEGIN;
CREATE TYPE "LiveSessionStatus_new" AS ENUM ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED');
ALTER TABLE "LiveSession" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "LiveSession" ALTER COLUMN "status" TYPE "LiveSessionStatus_new" USING ("status"::text::"LiveSessionStatus_new");
ALTER TYPE "LiveSessionStatus" RENAME TO "LiveSessionStatus_old";
ALTER TYPE "LiveSessionStatus_new" RENAME TO "LiveSessionStatus";
DROP TYPE "LiveSessionStatus_old";
ALTER TABLE "LiveSession" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';
COMMIT;
