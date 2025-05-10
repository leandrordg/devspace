-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "content" DROP NOT NULL;
