-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "seen_by_user_ids" TEXT[] DEFAULT ARRAY[]::TEXT[];
