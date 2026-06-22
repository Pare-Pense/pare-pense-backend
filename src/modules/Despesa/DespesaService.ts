import type { Categoria } from '../../generated/prisma/enums.js';
import type { Despesa } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { DespesaSchema } from './DespesaSchema.js';

export class DespesaService {
    constructor(private db = prisma) {}

    private formatadorHorario = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
    });

    private formataDespesa(despesa: Despesa) {
        return {
            ...despesa,
            valor: despesa.valor.toNumber(),
            horario: this.formatadorHorario.format(despesa.horario),
        };
    }

    async cadastrarDespesa(data: DespesaSchema) {
        const despesa = await this.db.despesa.create({
            data,
        });

        return {
            ...despesa,
            valor: despesa.valor.toNumber(),
            horario: this.formatadorHorario.format(despesa.horario),
        };
    }

    async recuperarDespesasAll(idUsuario: string, categoria?: Categoria) {
        const despesas = await this.db.despesa.findMany({
            where: {
                idUsuario: idUsuario,
                ...(categoria && { categoria: categoria }),
            },
        });

        return despesas.map((despesa) => this.formataDespesa(despesa));
    }

    async recuperarDespesa(idUsuario: string, idDespesa: string) {
        const despesa = await this.db.despesa.findUnique({
            where: { id: idDespesa },
        });

        if (!despesa) {
            throw new Error('Despesa não existe');
        }

        if (despesa.idUsuario !== idUsuario) {
            throw new Error('Despesa não pertence a esse usuário');
        }

        return {
            ...despesa,
            valor: despesa.valor.toNumber(),
            horario: this.formatadorHorario.format(despesa.horario),
        };
    }

    async recuperarMediaGastosPorCategoria(
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
            dataFim.setMonth(0, 1);
            dataFim.setFullYear(dataFim.getFullYear() + 1, 11, 31);
        }

        const mediaGastosPorCategoria = await this.db.despesa.groupBy({
            where: { idUsuario, data: { gte: dataInicio, lte: dataFim } },
            by: ['categoria'],
            _avg: { valor: true },
        });

        return mediaGastosPorCategoria;
    }

    async atualizaDespesa(
        idUsuario: string,
        idDespesa: string,
        data: DespesaSchema,
    ) {
        await this.recuperarDespesa(idUsuario, idDespesa);

        const despesa = await this.db.despesa.update({
            where: { id: idDespesa },
            data,
        });

        return {
            ...despesa,
            valor: despesa.valor.toNumber(),
            horario: this.formatadorHorario.format(despesa.horario),
        };
    }

    async deletarDespesa(idUsuario: string, idDespesa: string) {
        await this.recuperarDespesa(idUsuario, idDespesa);

        await this.db.despesa.delete({ where: { id: idDespesa } });

        return { message: 'Despesa deletada com sucesso' };
    }
}

export const despesaService = new DespesaService();
