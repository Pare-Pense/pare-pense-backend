import type { Categoria } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type {
    AtualizaCategoriaSchema,
    CategoriaSchema,
} from './CategoriaSchema.js';

const CATEGORIA_PADRAO_FALLBACK = 'OUTROS';

export class CategoriaService {
    constructor(private db = prisma) {}

    private formataCategoria(categoria: Categoria) {
        return {
            ...categoria,
            personalizada: categoria.idUsuario !== null,
        };
    }

    private async verificaNomeDisponivel(
        idUsuario: string,
        nome: string,
        idIgnorado?: string,
    ) {
        const categoriaExistente = await this.db.categoria.findFirst({
            where: {
                nome: { equals: nome, mode: 'insensitive' },
                OR: [{ idUsuario: null }, { idUsuario }],
                ...(idIgnorado && { NOT: { id: idIgnorado } }),
            },
        });

        if (categoriaExistente) {
            throw new Error('Categoria já existe');
        }
    }

    async listarCategorias(idUsuario: string) {
        const categorias = await this.db.categoria.findMany({
            where: { OR: [{ idUsuario: null }, { idUsuario }] },
            orderBy: { nome: 'asc' },
        });

        return categorias.map((categoria) => this.formataCategoria(categoria));
    }

    async recuperarCategoriaAcessivel(idUsuario: string, idCategoria: string) {
        const categoria = await this.db.categoria.findUnique({
            where: { id: idCategoria },
        });

        if (!categoria) {
            throw new Error('Categoria não existe');
        }

        if (categoria.idUsuario !== null && categoria.idUsuario !== idUsuario) {
            throw new Error('Categoria não pertence a esse usuário');
        }

        return this.formataCategoria(categoria);
    }

    async recuperarCategoriaPersonalizada(
        idUsuario: string,
        idCategoria: string,
    ) {
        const categoria = await this.recuperarCategoriaAcessivel(
            idUsuario,
            idCategoria,
        );

        if (!categoria.personalizada) {
            throw new Error('Categorias padrão não podem ser alteradas');
        }

        return categoria;
    }

    async cadastrarCategoria(data: CategoriaSchema) {
        await this.verificaNomeDisponivel(data.idUsuario, data.nome);

        const categoria = await this.db.categoria.create({ data });

        return this.formataCategoria(categoria);
    }

    async atualizarCategoria(
        idUsuario: string,
        idCategoria: string,
        data: AtualizaCategoriaSchema,
    ) {
        await this.recuperarCategoriaPersonalizada(idUsuario, idCategoria);
        await this.verificaNomeDisponivel(idUsuario, data.nome, idCategoria);

        const categoria = await this.db.categoria.update({
            where: { id: idCategoria },
            data,
        });

        return this.formataCategoria(categoria);
    }

    async deletarCategoria(idUsuario: string, idCategoria: string) {
        await this.recuperarCategoriaPersonalizada(idUsuario, idCategoria);

        const categoriaFallback = await this.db.categoria.findFirst({
            where: { idUsuario: null, nome: CATEGORIA_PADRAO_FALLBACK },
        });

        if (!categoriaFallback) {
            throw new Error(
                `Categoria padrão ${CATEGORIA_PADRAO_FALLBACK} não encontrada`,
            );
        }

        await this.db.$transaction([
            this.db.despesa.updateMany({
                where: { idCategoria },
                data: { idCategoria: categoriaFallback.id },
            }),
            this.db.categoria.delete({ where: { id: idCategoria } }),
        ]);

        return { message: 'Categoria deletada com sucesso' };
    }
}

export const categoriaService = new CategoriaService();
