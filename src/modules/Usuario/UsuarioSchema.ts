import { z } from 'zod';

export const criarUsuarioSchema = z.object({
    nome: z.string().min(3, 'O nome precisa ter no mínimo 3 letras'),
    dataNascimento: z.coerce.date({
        error: () => ({ message: 'Data de nascimento inválida' }),
    }),
    email: z.email('Formato de e-mail inválido'),
    senha: z.string(),
    rendaMensal: z.number().positive('A renda não pode ser negativa'), // talvez fazer uma alteração pra renda 0
    limiteMensal: z.number().positive('O limite não pode ser negativo'),
});

export type UsuarioSchema = z.infer<typeof criarUsuarioSchema>;
