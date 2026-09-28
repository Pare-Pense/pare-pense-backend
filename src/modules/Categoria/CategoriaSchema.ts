import { z } from 'zod';

export const criarCategoriaSchema = z.object({
    nome: z
        .string()
        .trim()
        .min(2, 'O nome precisa ter no mínimo 2 letras')
        .max(30, 'O nome pode ter no máximo 30 letras'),
    idUsuario: z.uuid('O ID do usuário está em um formato inválido'),
});

export const atualizarCategoriaSchema = criarCategoriaSchema.omit({
    idUsuario: true,
});

export type CategoriaSchema = z.infer<typeof criarCategoriaSchema>;
export type AtualizaCategoriaSchema = z.infer<typeof atualizarCategoriaSchema>;
