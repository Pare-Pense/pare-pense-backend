import { z } from 'zod';
import { Categoria } from '../../generated/prisma/enums.js';

export const criarDespesaSchema = z.object({
    nome: z.string().min(3, 'O nome precisa ter no mínimo 3 letras'),
    categoria: z.enum(Categoria, {
        error: () => ({
            message:
                'Categoria inválida. Apenas: ALIMENTACAO, LAZER, TRANSPORTE, COMPRAS, CONTAS ou OUTROS',
        }),
    }),
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
    .enum(Categoria, {
        error: () => ({
            message:
                'Categoria inválida. Apenas: ALIMENTACAO, LAZER, TRANSPORTE, COMPRAS, CONTAS ou OUTROS',
        }),
    })
    .optional();

export const periodoSchema = z.enum(['semanal', 'mensal', 'anual'], {
    error: () => ({ message: 'Período inválido' }),
});

export type DespesaSchema = z.infer<typeof criarDespesaSchema>;
export type AtualizaDespesaSchema = z.infer<typeof atualizarDespesaSchema>;
