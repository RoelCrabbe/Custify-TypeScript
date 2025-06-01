/*
  Warnings:

  - You are about to drop the column `updatedDate` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "updatedDate",
ADD COLUMN     "modifiedDate" TIMESTAMP(3);
