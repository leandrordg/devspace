/*
  Warnings:

  - You are about to drop the column `isActive` on the `Comment` table. All the data in the column will be lost.
  - The `published` column on the `Comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isActive` on the `Post` table. All the data in the column will be lost.
  - The `published` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "isActive",
DROP COLUMN "published",
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isActive",
DROP COLUMN "published",
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;
