-- DropIndex
DROP INDEX "ProductPackage_productType_active_displayOrder_idx";

-- AlterTable
ALTER TABLE "ProductPackage" DROP COLUMN "active";

-- CreateIndex
CREATE INDEX "ProductPackage_productType_displayOrder_idx" ON "ProductPackage"("productType", "displayOrder");
