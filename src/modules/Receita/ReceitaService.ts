import { prisma } from '../../lib/prisma.js';
import type { ReceitaSchema } from './ReceitaSchema.js';

export class ReceitaService {
    constructor(private db = prisma) {}

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

        return receitas.map((receita) => ({
            ...receita,
            valor: receita.valor.toNumber(),
        }));
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
