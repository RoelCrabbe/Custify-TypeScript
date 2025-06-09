/*
  Warnings:

  - You are about to drop the `errorlogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "errorlogs";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "createdById" INTEGER,
    "modifiedById" INTEGER,
    "userName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passWord" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Guest',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "phoneNumber" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorLogs" (
    "id" SERIAL NOT NULL,
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "createdById" INTEGER,
    "modifiedById" INTEGER,
    "type" TEXT NOT NULL DEFAULT 'Application Error',
    "severity" TEXT NOT NULL DEFAULT 'Handled',
    "httpMethod" TEXT NOT NULL DEFAULT 'Post',
    "errorMessage" TEXT NOT NULL,
    "stackTrace" TEXT NOT NULL DEFAULT 'No StackTrace Available',
    "requestPath" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'New',
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedBy" INTEGER,
    "archivedDate" TIMESTAMP(3),

    CONSTRAINT "ErrorLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_userName_key" ON "Users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
