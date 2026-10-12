import { z } from 'zod';

export const criarDespesaSchema = z.object({
    nome: z.string().min(3, 'O nome precisa ter no mínimo 3 letras'),
    idCategoria: z.uuid('O ID da categoria está em um formato inválido'),
    data: z.coerce.date({
        error: () => ({ message: 'Data inválida' }),
    }),
    valor: z.number().positive('O valor não pode ser negativo'),
    idUsuario: z.uuid('O ID do usuário está em um formato inválido'),
});

export const atualizarDespesaSchema = criarDespesaSchema
    .omit({ idUsuario: true })
    .partial();

export const validaCategoria = z
    .uuid('O ID da categoria está em um formato inválido')
    .optional();

export const periodoSchema = z.enum(['semanal', 'mensal', 'anual'], {
    error: () => ({ message: 'Período inválido' }),
});

export type DespesaSchema = z.infer<typeof criarDespesaSchema>;
export type AtualizaDespesaSchema = z.infer<typeof atualizarDespesaSchema>;
