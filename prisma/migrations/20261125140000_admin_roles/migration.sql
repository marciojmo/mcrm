-- AlterTable
ALTER TABLE "users" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN "banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "ban_reason" TEXT,
ADD COLUMN "ban_expires" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN "impersonated_by" TEXT;

UPDATE "users" SET "role" = 'admin' WHERE lower("email") = 'marcio@ayatecnologia.com';
