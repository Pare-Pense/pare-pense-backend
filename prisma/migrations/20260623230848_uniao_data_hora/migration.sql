/*
  Warnings:

  - You are about to drop the column `horario` on the `Despesa` table. All the data in the column will be lost.
  - You are about to drop the column `horario` on the `Receita` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Despesa" DROP COLUMN "horario",
ALTER COLUMN "data" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Receita" DROP COLUMN "horario",
ALTER COLUMN "data" SET DATA TYPE TIMESTAMP(3);
