/*
  Warnings:

  - You are about to drop the column `isExpectedFailure` on the `errorlogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "errorlogs" DROP COLUMN "isExpectedFailure",
ADD COLUMN     "severity" TEXT NOT NULL DEFAULT 'Handled';
