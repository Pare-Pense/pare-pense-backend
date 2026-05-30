-- CreateTable
CREATE TABLE "Receita" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data" DATE NOT NULL,
    "horario" TIME NOT NULL,
    "idUsuario" TEXT NOT NULL,

    CONSTRAINT "Receita_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
