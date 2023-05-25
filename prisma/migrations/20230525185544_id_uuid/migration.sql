/*
  Warnings:

  - The primary key for the `accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `buybonus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `buymiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sellmiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stripeId` on the `subscriptions` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "buybonus" DROP CONSTRAINT "buybonus_userId_fkey";

-- DropForeignKey
ALTER TABLE "buymiles" DROP CONSTRAINT "buymiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "sellmiles" DROP CONSTRAINT "sellmiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_userId_fkey";

-- AlterTable
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "accounts_id_seq";

-- AlterTable
ALTER TABLE "buybonus" DROP CONSTRAINT "buybonus_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "priceProtection" DROP NOT NULL,
ALTER COLUMN "transfer" DROP NOT NULL,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "buybonus_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "buybonus_id_seq";

-- AlterTable
ALTER TABLE "buymiles" DROP CONSTRAINT "buymiles_pkey",
ADD COLUMN     "transfer" BOOLEAN,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "buymiles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "buymiles_id_seq";

-- AlterTable
ALTER TABLE "sellmiles" DROP CONSTRAINT "sellmiles_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "sellmiles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sellmiles_id_seq";

-- AlterTable
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_pkey",
DROP COLUMN "stripeId",
ADD COLUMN     "subscriptionId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "subscriptions_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "status",
ADD COLUMN     "subscriptionId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- CreateTable
CREATE TABLE "buybumerangue" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "pointsQuantity" INTEGER NOT NULL,
    "dateBuy" TEXT NOT NULL,
    "selectedAccount" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "destinyOne" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "miles" INTEGER,
    "returnPercentage" INTEGER,
    "points" INTEGER,
    "transfer" BOOLEAN,
    "percentageTwo" INTEGER,
    "destinyTwo" TEXT,
    "milesTwo" INTEGER,
    "totalMiles" INTEGER NOT NULL,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "buybumerangue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buybumerangue_id_key" ON "buybumerangue"("id");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buymiles" ADD CONSTRAINT "buymiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellmiles" ADD CONSTRAINT "sellmiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buybonus" ADD CONSTRAINT "buybonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buybumerangue" ADD CONSTRAINT "buybumerangue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
