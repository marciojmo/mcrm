-- AlterTable
ALTER TABLE "labels" ADD COLUMN "board_id" TEXT;

-- Copy each label used in tasks to every board that uses it
CREATE TEMPORARY TABLE "label_board_map" AS
SELECT "pairs"."old_id", "pairs"."board_id", gen_random_uuid()::TEXT AS "new_id"
FROM (
    SELECT DISTINCT "task_labels"."label_id" AS "old_id", "panels"."board_id" AS "board_id"
    FROM "task_labels"
    JOIN "tasks" ON "tasks"."id" = "task_labels"."task_id"
    JOIN "panels" ON "panels"."id" = "tasks"."panel_id"
) AS "pairs";

INSERT INTO "labels" ("id", "name", "color", "created_at", "board_id")
SELECT "map"."new_id", "labels"."name", "labels"."color", "labels"."created_at", "map"."board_id"
FROM "label_board_map" AS "map"
JOIN "labels" ON "labels"."id" = "map"."old_id";

INSERT INTO "task_labels" ("task_id", "label_id")
SELECT "task_labels"."task_id", "map"."new_id"
FROM "task_labels"
JOIN "tasks" ON "tasks"."id" = "task_labels"."task_id"
JOIN "panels" ON "panels"."id" = "tasks"."panel_id"
JOIN "label_board_map" AS "map"
    ON "map"."old_id" = "task_labels"."label_id" AND "map"."board_id" = "panels"."board_id";

-- Remove the original global labels (cascades to their old task_labels rows); copies keep board_id
DELETE FROM "labels" WHERE "board_id" IS NULL;

DROP TABLE "label_board_map";

-- AlterTable
ALTER TABLE "labels" ALTER COLUMN "board_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "labels_board_id_idx" ON "labels"("board_id");

-- AddForeignKey
ALTER TABLE "labels" ADD CONSTRAINT "labels_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
