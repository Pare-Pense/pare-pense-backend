import { z } from 'zod';
import { Categoria } from '../../generated/prisma/enums.js';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const criarReceitaSchema = z.object({
    nome: z.string().min(3, 'O nome precisa ter no mínimo 3 letras'),
    data: z.coerce.date({
        error: () => ({ message: 'Data inválida' }),
    }),
    horario: z
        .string()
        .regex(timeRegex, { message: 'Horário inválido. Use o formato HH:mm' })
        .transform((val) => {
            const [hours, minutes] = val.split(':');

            const date = new Date();
            date.setHours(Number(hours), Number(minutes), 0, 0);

            return date;
        }),
    valor: z.number().positive('O valor não pode ser negativo'),
    idUsuario: z.uuid('O ID do usuário está em um formato inválido'),
});

export const atualizarReceitaSchema = criarReceitaSchema
    .omit({ idUsuario: true })
    .partial();

export type ReceitaSchema = z.infer<typeof criarReceitaSchema>;
export type AtualizaReceitaSchema = z.infer<typeof atualizarReceitaSchema>;
