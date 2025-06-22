/*
  Warnings:

  - You are about to drop the `UserImages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserImages" DROP CONSTRAINT "UserImages_userId_fkey";

-- DropTable
DROP TABLE "UserImages";

-- CreateTable
CREATE TABLE "ProfileImages" (
    "id" SERIAL NOT NULL,
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "createdById" INTEGER,
    "modifiedById" INTEGER,
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProfileImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileImages_userId_key" ON "ProfileImages"("userId");

-- AddForeignKey
ALTER TABLE "ProfileImages" ADD CONSTRAINT "ProfileImages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
