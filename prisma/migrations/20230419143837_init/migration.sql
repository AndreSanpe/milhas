-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "birthdate" TEXT NOT NULL,
    "cellphone" TEXT NOT NULL,
    "stripeCustomer" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "statusLivelo" BOOLEAN NOT NULL,
    "priceLivelo" DOUBLE PRECISION NOT NULL,
    "statusEsfera" BOOLEAN NOT NULL,
    "priceEsfera" DOUBLE PRECISION NOT NULL,
    "statusLatam" BOOLEAN NOT NULL,
    "priceLatam" DOUBLE PRECISION NOT NULL,
    "statusAzul" BOOLEAN NOT NULL,
    "priceAzul" DOUBLE PRECISION NOT NULL,
    "statusSmiles" BOOLEAN NOT NULL,
    "priceSmiles" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buymiles" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "pointsQuantity" INTEGER NOT NULL,
    "dateBuy" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "selectedAccount" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "destiny" TEXT,
    "percentage" INTEGER,
    "creditCard" TEXT,
    "parcel" TEXT,
    "month" TEXT,
    "miles" INTEGER,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "buymiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellmiles" (
    "id" SERIAL NOT NULL,
    "pointsQuantity" INTEGER NOT NULL,
    "priceBuy" DOUBLE PRECISION NOT NULL,
    "priceSell" DOUBLE PRECISION NOT NULL,
    "program" TEXT NOT NULL,
    "programBuyer" TEXT NOT NULL,
    "selectedAccount" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "receipt" INTEGER,
    "dateSell" TEXT,
    "dateReceipt" TEXT,
    "profit" DOUBLE PRECISION NOT NULL,
    "percentageProfit" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "sellmiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buybonus" (
    "id" SERIAL NOT NULL,
    "product" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "pointsForReal" INTEGER NOT NULL,
    "program" TEXT NOT NULL,
    "pointsQuantity" INTEGER NOT NULL,
    "currencyOption" TEXT,
    "pointsCard" DOUBLE PRECISION,
    "pointsCardQuantity" INTEGER,
    "totalpoints" INTEGER,
    "destiny" TEXT,
    "percentage" INTEGER,
    "miles" INTEGER,
    "secureValue" DOUBLE PRECISION,
    "sellPrice" DOUBLE PRECISION NOT NULL,
    "priceMiles" DOUBLE PRECISION NOT NULL,
    "percentageProfit" DOUBLE PRECISION NOT NULL,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "score" BOOLEAN NOT NULL,
    "priceProtection" BOOLEAN NOT NULL,
    "transfer" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "buybonus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_id_key" ON "accounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "buymiles_id_key" ON "buymiles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sellmiles_id_key" ON "sellmiles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "buybonus_id_key" ON "buybonus"("id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buymiles" ADD CONSTRAINT "buymiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellmiles" ADD CONSTRAINT "sellmiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buybonus" ADD CONSTRAINT "buybonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
