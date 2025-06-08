/*
  Warnings:

  - You are about to drop the `ErrorLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ErrorLog";

-- CreateTable
CREATE TABLE "errorlogs" (
    "id" SERIAL NOT NULL,
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "createdById" INTEGER,
    "modifiedById" INTEGER,
    "type" TEXT NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "stackTrace" TEXT NOT NULL,
    "requestPath" TEXT NOT NULL,
    "httpMethod" TEXT NOT NULL,
    "isExpectedFailure" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "errorlogs_pkey" PRIMARY KEY ("id")
);
