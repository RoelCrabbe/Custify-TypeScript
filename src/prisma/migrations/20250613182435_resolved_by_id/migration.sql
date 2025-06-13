/*
  Warnings:

  - You are about to drop the column `resolvedBy` on the `ErrorLogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ErrorLogs" DROP COLUMN "resolvedBy",
ADD COLUMN     "resolvedById" INTEGER;
