ALTER TABLE "boards" ADD COLUMN "owner_id" TEXT;
UPDATE "boards" SET "owner_id" = (SELECT "id" FROM "users" ORDER BY "created_at" LIMIT 1);
DELETE FROM "boards" WHERE "owner_id" IS NULL;
ALTER TABLE "boards" ALTER COLUMN "owner_id" SET NOT NULL;

CREATE INDEX "boards_owner_id_idx" ON "boards"("owner_id");

ALTER TABLE "boards" ADD CONSTRAINT "boards_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
