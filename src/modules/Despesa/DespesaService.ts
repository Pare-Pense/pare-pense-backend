import { prisma } from '../../lib/prisma.js';
import type { DespesaSchema } from './DespesaSchema.js';

export class DespesaService {
    constructor(private db = prisma) {}

    async cadastrarDespesa(data: DespesaSchema) {
        const despesa = await this.db.despesa.create({
            data,
        });

        return despesa;
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

        return despesa;
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

        return despesa;
    }

    async deletarDespesa(idUsuario: string, idDespesa: string) {
        await this.recuperarDespesa(idUsuario, idDespesa);

        await this.db.despesa.delete({ where: { id: idDespesa } });

        return { message: 'Despesa deletada com sucesso' };
    }
}

export const despesaService = new DespesaService();
