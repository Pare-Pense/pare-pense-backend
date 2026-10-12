import { z } from 'zod';

const camposBaseSchema = z.object({
    nome: z.string().min(3, 'O nome precisa ter no mínimo 3 letras'),
    idCategoria: z.uuid('O ID da categoria está em um formato inválido'),
    valor: z.number().positive('O valor não pode ser negativo'),
    idUsuario: z.uuid('O ID do usuário está em um formato inválido'),
    frequencia: z.enum(['SEMANAL', 'MENSAL', 'ANUAL'], {
        error: () => ({
            message: 'Frequência inválida. Apenas: SEMANAL, MENSAL ou ANUAL',
        }),
    }),
    diaSemana: z
        .number()
        .int()
        .min(0, 'diaSemana deve ser entre 0 (domingo) e 6 (sábado)')
        .max(6, 'diaSemana deve ser entre 0 (domingo) e 6 (sábado)')
        .optional(),
    diaMes: z
        .number()
        .int()
        .min(1, 'diaMes deve ser entre 1 e 31')
        .max(31, 'diaMes deve ser entre 1 e 31')
        .optional(),
    mes: z
        .number()
        .int()
        .min(1, 'mes deve ser entre 1 e 12')
        .max(12, 'mes deve ser entre 1 e 12')
        .optional(),
    dataInicio: z.coerce.date({
        error: () => ({ message: 'Data de início inválida' }),
    }),
    dataFim: z.coerce
        .date({ error: () => ({ message: 'Data de fim inválida' }) })
        .optional(),
});

function validaCamposDaFrequencia(
    data: z.infer<typeof camposBaseSchema>,
    ctx: z.RefinementCtx,
) {
    if (data.frequencia === 'SEMANAL' && data.diaSemana === undefined) {
        ctx.addIssue({
            code: 'custom',
            path: ['diaSemana'],
            message: 'diaSemana é obrigatório para frequência SEMANAL',
        });
    }

    if (data.frequencia === 'MENSAL' && data.diaMes === undefined) {
        ctx.addIssue({
            code: 'custom',
            path: ['diaMes'],
            message: 'diaMes é obrigatório para frequência MENSAL',
        });
    }

    if (data.frequencia === 'ANUAL') {
        if (data.diaMes === undefined) {
            ctx.addIssue({
                code: 'custom',
                path: ['diaMes'],
                message: 'diaMes é obrigatório para frequência ANUAL',
            });
        }

        if (data.mes === undefined) {
            ctx.addIssue({
                code: 'custom',
                path: ['mes'],
                message: 'mes é obrigatório para frequência ANUAL',
            });
        }
    }
}

export const criarDespesaRecorrenteSchema = camposBaseSchema.superRefine(
    validaCamposDaFrequencia,
);

export const atualizarDespesaRecorrenteSchema = camposBaseSchema
    .omit({ idUsuario: true })
    .partial()
    .superRefine((data, ctx) => {
        if (data.frequencia) {
            validaCamposDaFrequencia(
                data as z.infer<typeof camposBaseSchema>,
                ctx,
            );
        }
    });

export type DespesaRecorrenteSchema = z.infer<
    typeof criarDespesaRecorrenteSchema
>;
export type AtualizaDespesaRecorrenteSchema = z.infer<
    typeof atualizarDespesaRecorrenteSchema
>;
