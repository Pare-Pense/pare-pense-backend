import type { Receita } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { ReceitaSchema } from './ReceitaSchema.js';

export class ReceitaService {
    constructor(private db = prisma) {}

    private formataReceita(receita: Receita) {
        return {
            ...receita,
            valor: receita.valor.toNumber(),
        };
    }

    async cadastrarReceita(data: ReceitaSchema) {
        const receita = await this.db.receita.create({
            data,
        });

        return {
            ...receita,
            valor: receita.valor.toNumber(),
        };
    }

    async recuperarReceitasAll(idUsuario: string) {
        const receitas = await this.db.receita.findMany({
            where: { idUsuario },
        });

        return receitas.map((receita) => this.formataReceita(receita));
    }

    async recuperarReceitasPorPeriodo(
        idUsuario: string,
        periodo: 'semanal' | 'mensal' | 'anual',
    ) {
        const dataFim = new Date();
        const dataInicio = new Date();

        dataInicio.setHours(0, 0, 0, 0);
        dataFim.setHours(23, 59, 59, 999);

        if (periodo === 'semanal') {
            const diaSemana = dataInicio.getDay();
            dataInicio.setDate(dataInicio.getDate() - diaSemana);
            dataFim.setDate(dataFim.getDate() + (6 - diaSemana));
        } else if (periodo === 'mensal') {
            dataInicio.setDate(1);
            dataFim.setMonth(dataFim.getMonth() + 1, 0);
        } else if (periodo === 'anual') {
            dataInicio.setMonth(0, 1);
            dataFim.setMonth(11, 31);
        }

        const receitas = await this.db.receita.findMany({
            where: {
                idUsuario,
                data: {
                    gte: dataInicio,
                    lte: dataFim,
                },
            },
            orderBy: {
                data: 'asc',
            },
        });

        return receitas.map(this.formataReceita);
    }

    async recuperarReceita(idUsuario: string, idReceita: string) {
        const receita = await this.db.receita.findUnique({
            where: { id: idReceita },
        });

        if (!receita) {
            throw new Error('Receita não existe');
        }

        if (receita.idUsuario !== idUsuario) {
            throw new Error('Receita não pertence a esse usuário');
        }

        return {
            ...receita,
            valor: receita.valor.toNumber(),
        };
    }

    async atualizaReceita(
        idUsuario: string,
        idReceita: string,
        data: ReceitaSchema,
    ) {
        await this.recuperarReceita(idUsuario, idReceita);

        const receita = await this.db.receita.update({
            where: { id: idReceita },
            data,
        });

        return {
            ...receita,
            valor: receita.valor.toNumber(),
        };
    }

    async deletarReceita(idUsuario: string, idReceita: string) {
        await this.recuperarReceita(idUsuario, idReceita);

        await this.db.receita.delete({ where: { id: idReceita } });

        return { message: 'Receita deletada com sucesso' };
    }
}
export const receitaService = new ReceitaService();
