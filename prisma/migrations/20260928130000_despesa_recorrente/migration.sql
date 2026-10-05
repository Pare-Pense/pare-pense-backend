CREATE TYPE "FrequenciaRecorrencia" AS ENUM ('SEMANAL', 'MENSAL', 'ANUAL');

ALTER TABLE "Despesa" ADD COLUMN     "idDespesaRecorrente" TEXT;

CREATE TABLE "DespesaRecorrente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "idCategoria" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "frequencia" "FrequenciaRecorrencia" NOT NULL,
    "diaSemana" INTEGER,
    "diaMes" INTEGER,
    "mes" INTEGER,
    "dataInicio" DATE NOT NULL,
    "dataFim" DATE,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "idUsuario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DespesaRecorrente_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DespesaRecorrente_idUsuario_idx" ON "DespesaRecorrente"("idUsuario");

CREATE UNIQUE INDEX "Despesa_idDespesaRecorrente_data_key" ON "Despesa"("idDespesaRecorrente", "data");

ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_idDespesaRecorrente_fkey" FOREIGN KEY ("idDespesaRecorrente") REFERENCES "DespesaRecorrente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DespesaRecorrente" ADD CONSTRAINT "DespesaRecorrente_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "DespesaRecorrente" ADD CONSTRAINT "DespesaRecorrente_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

