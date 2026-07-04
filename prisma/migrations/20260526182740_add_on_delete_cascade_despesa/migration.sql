-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('ALIMENTACAO', 'LAZER', 'TRANSPORTE', 'COMPRAS', 'CONTAS', 'OUTROS');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" DATE NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "rendaMensal" DECIMAL(10,2) NOT NULL,
    "limiteMensal" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Despesa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "data" DATE NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "horario" TIME NOT NULL,
    "idUsuario" TEXT NOT NULL,

    CONSTRAINT "Despesa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
