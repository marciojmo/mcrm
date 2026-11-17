-- AlterTable
ALTER TABLE "boards" ADD COLUMN "key" VARCHAR(4),
ADD COLUMN "last_task_number" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN "number" INTEGER;

-- Backfill board keys
WITH "bases" AS (
    SELECT "id",
        RPAD(LEFT(REGEXP_REPLACE(UPPER(TRANSLATE("name", 'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ', 'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN')), '[^A-Z]', '', 'g'), 4), 4, 'X') AS "base",
        "created_at"
    FROM "boards"
), "ranked" AS (
    SELECT "id", "base",
        ROW_NUMBER() OVER (PARTITION BY "base" ORDER BY "created_at", "id") AS "rank"
    FROM "bases"
)
UPDATE "boards" SET "key" = CASE
    WHEN "ranked"."rank" = 1 THEN "ranked"."base"
    ELSE LEFT("ranked"."base", 3) || CHR(63 + "ranked"."rank"::INTEGER)
END
FROM "ranked"
WHERE "boards"."id" = "ranked"."id";

-- Backfill task numbers
WITH "numbered" AS (
    SELECT "tasks"."id",
        ROW_NUMBER() OVER (PARTITION BY "panels"."board_id" ORDER BY "tasks"."created_at", "tasks"."id") AS "number"
    FROM "tasks"
    JOIN "panels" ON "panels"."id" = "tasks"."panel_id"
)
UPDATE "tasks" SET "number" = "numbered"."number"
FROM "numbered"
WHERE "tasks"."id" = "numbered"."id";

UPDATE "boards" SET "last_task_number" = COALESCE((
    SELECT MAX("tasks"."number")
    FROM "tasks"
    JOIN "panels" ON "panels"."id" = "tasks"."panel_id"
    WHERE "panels"."board_id" = "boards"."id"
), 0);

ALTER TABLE "boards" ALTER COLUMN "key" SET NOT NULL;
ALTER TABLE "tasks" ALTER COLUMN "number" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "boards_key_key" ON "boards"("key");
