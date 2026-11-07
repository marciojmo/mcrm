CREATE TABLE "boards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

INSERT INTO "boards" ("id", "name") VALUES ('default-board', 'Geral');

ALTER TABLE "panels" ADD COLUMN "board_id" TEXT;
UPDATE "panels" SET "board_id" = 'default-board';
ALTER TABLE "panels" ALTER COLUMN "board_id" SET NOT NULL;

CREATE INDEX "panels_board_id_idx" ON "panels"("board_id");

ALTER TABLE "panels" ADD CONSTRAINT "panels_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
