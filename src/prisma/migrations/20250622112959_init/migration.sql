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
CREATE TABLE "UserImages" (
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

    CONSTRAINT "UserImages_pkey" PRIMARY KEY ("id")
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
    "resolvedById" INTEGER,
    "resolvedDate" TIMESTAMP(3),

    CONSTRAINT "ErrorLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "createdById" INTEGER,
    "modifiedById" INTEGER,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "category" TEXT NOT NULL DEFAULT 'General',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "sentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readDate" TIMESTAMP(3),
    "recipientById" INTEGER NOT NULL,
    "sentById" INTEGER,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_userName_key" ON "Users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserImages_userId_key" ON "UserImages"("userId");

-- AddForeignKey
ALTER TABLE "UserImages" ADD CONSTRAINT "UserImages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_recipientById_fkey" FOREIGN KEY ("recipientById") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
