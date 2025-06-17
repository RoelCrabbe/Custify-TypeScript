/*
  Warnings:

  - You are about to drop the column `recipientId` on the `Notifications` table. All the data in the column will be lost.
  - Added the required column `recipientById` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_recipientId_fkey";

-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "recipientId",
ADD COLUMN     "recipientById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_recipientById_fkey" FOREIGN KEY ("recipientById") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
