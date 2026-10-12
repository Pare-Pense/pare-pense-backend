ALTER TYPE "Categoria" RENAME TO "Categoria_old";

CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "idUsuario" TEXT,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);


CREATE INDEX "Categoria_idUsuario_idx" ON "Categoria"("idUsuario");

CREATE UNIQUE INDEX "Categoria_idUsuario_nome_key" ON "Categoria"("idUsuario", "nome");

ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "Categoria" ("id", "nome", "idUsuario") VALUES
    (gen_random_uuid()::text, 'ALIMENTACAO', NULL),
    (gen_random_uuid()::text, 'LAZER', NULL),
    (gen_random_uuid()::text, 'TRANSPORTE', NULL),
    (gen_random_uuid()::text, 'COMPRAS', NULL),
    (gen_random_uuid()::text, 'CONTAS', NULL),
    (gen_random_uuid()::text, 'OUTROS', NULL);

ALTER TABLE "Despesa" ADD COLUMN "idCategoria" TEXT;

UPDATE "Despesa" d
SET "idCategoria" = c."id"
FROM "Categoria" c
WHERE c."idUsuario" IS NULL AND c."nome" = d."categoria"::text;

ALTER TABLE "Despesa" ALTER COLUMN "idCategoria" SET NOT NULL;

ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Despesa" DROP COLUMN "categoria";

DROP TYPE "Categoria_old";
