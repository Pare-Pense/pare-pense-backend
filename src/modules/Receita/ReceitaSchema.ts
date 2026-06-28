import { z } from 'zod';

export const criarReceitaSchema = z.object({
    nome: z.string().min(3, 'O nome precisa ter no mínimo 3 letras'),
    data: z.coerce.date({
        error: () => ({ message: 'Data inválida' }),
    }),
    valor: z.number().positive('O valor não pode ser negativo'),
    idUsuario: z.uuid('O ID do usuário está em um formato inválido'),
});

export const atualizarReceitaSchema = criarReceitaSchema
    .omit({ idUsuario: true })
    .partial();

export type ReceitaSchema = z.infer<typeof criarReceitaSchema>;
export type AtualizaReceitaSchema = z.infer<typeof atualizarReceitaSchema>;

export const periodoSchema = z.enum(['semanal', 'mensal', 'anual'], {
    error: () => ({ message: 'Período inválido' }),
});
