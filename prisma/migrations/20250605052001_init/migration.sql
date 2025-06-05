-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FRESH', 'SPOILED');

-- CreateTable
CREATE TABLE "Meat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "rawProbability" DOUBLE PRECISION NOT NULL,
    "category" "Category" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meat_pkey" PRIMARY KEY ("id")
);
