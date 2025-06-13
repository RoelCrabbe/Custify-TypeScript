/*
  Warnings:

  - You are about to drop the column `archivedBy` on the `ErrorLogs` table. All the data in the column will be lost.
  - You are about to drop the column `archivedDate` on the `ErrorLogs` table. All the data in the column will be lost.
  - You are about to drop the column `isArchived` on the `ErrorLogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ErrorLogs" DROP COLUMN "archivedBy",
DROP COLUMN "archivedDate",
DROP COLUMN "isArchived",
ADD COLUMN     "resolvedBy" INTEGER,
ADD COLUMN     "resolvedDate" TIMESTAMP(3);
