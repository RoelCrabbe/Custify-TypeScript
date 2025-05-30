-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3),
    "userName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passWord" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
