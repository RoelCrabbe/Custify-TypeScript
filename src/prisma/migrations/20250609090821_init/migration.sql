-- CreateTable
CREATE TABLE "users" (
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

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "errorlogs" (
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

    CONSTRAINT "errorlogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
