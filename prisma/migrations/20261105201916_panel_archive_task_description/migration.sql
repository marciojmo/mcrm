-- AlterTable
ALTER TABLE "panels" ADD COLUMN     "archived_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "description" TEXT;
