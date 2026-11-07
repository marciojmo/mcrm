ALTER TABLE "boards" ADD COLUMN "archived_at" TIMESTAMP(3);

CREATE TABLE "board_members" (
    "board_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "board_members_pkey" PRIMARY KEY ("board_id","user_id")
);

ALTER TABLE "board_members" ADD CONSTRAINT "board_members_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "board_members" ADD CONSTRAINT "board_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
