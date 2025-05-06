/*
  Warnings:

  - You are about to drop the column `published` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "published",
ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false;
