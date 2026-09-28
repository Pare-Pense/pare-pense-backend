import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { CategoriaService } from './CategoriaService.js';
import type { Categoria, PrismaClient } from '../../generated/prisma/client.js';

const categoriaPadrao: Categoria = {
    id: 'cat-lazer-uuid',
    nome: 'LAZER',
    idUsuario: null,
};

const categoriaOutros: Categoria = {
    id: 'cat-outros-uuid',
    nome: 'OUTROS',
    idUsuario: null,
};

const categoriaPersonalizada: Categoria = {
    id: 'cat-academia-uuid',
    nome: 'Academia',
    idUsuario: '321-uuid',
};

describe('CategoriaService - Testes de Unidade', () => {
    const mockPrisma = mockDeep<PrismaClient>();

    const categoriaService = new CategoriaService(mockPrisma);

    beforeEach(() => {
        mockReset(mockPrisma);
    });

    describe('Função: Listar categorias', () => {
        it('lista categorias padrão e personalizadas do usuário', async () => {
            mockPrisma.categoria.findMany.mockResolvedValue([
                categoriaPersonalizada,
                categoriaPadrao,
            ]);

            const categorias =
                await categoriaService.listarCategorias('321-uuid');

            expect(categorias.length).toBe(2);
            expect(categorias[0]?.personalizada).toBe(true);
            expect(categorias[1]?.personalizada).toBe(false);
            expect(mockPrisma.categoria.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        OR: [{ idUsuario: null }, { idUsuario: '321-uuid' }],
                    },
                }),
            );
        });
    });

    describe('Função: Cadastrar categoria', () => {
        it('cadastra categoria com sucesso', async () => {
            mockPrisma.categoria.findFirst.mockResolvedValue(null);
            mockPrisma.categoria.create.mockResolvedValue(
                categoriaPersonalizada,
            );

            const categoria = await categoriaService.cadastrarCategoria({
                nome: 'Academia',
                idUsuario: '321-uuid',
            });

            expect(categoria.nome).toBe('Academia');
            expect(categoria.personalizada).toBe(true);
            expect(mockPrisma.categoria.create).toHaveBeenCalledOnce();
        });

        it('lança erro quando o nome já existe', async () => {
            mockPrisma.categoria.findFirst.mockResolvedValue(
                categoriaPersonalizada,
            );

            await expect(() =>
                categoriaService.cadastrarCategoria({
                    nome: 'academia',
                    idUsuario: '321-uuid',
                }),
            ).rejects.toThrow('Categoria já existe');
            expect(mockPrisma.categoria.create).not.toHaveBeenCalled();
        });

        it('lança erro quando o nome é de uma categoria padrão', async () => {
            mockPrisma.categoria.findFirst.mockResolvedValue(categoriaPadrao);

            await expect(() =>
                categoriaService.cadastrarCategoria({
                    nome: 'Lazer',
                    idUsuario: '321-uuid',
                }),
            ).rejects.toThrow('Categoria já existe');
        });
    });

    describe('Função: Recuperar categoria acessível', () => {
        it('aceita categoria padrão', async () => {
            mockPrisma.categoria.findUnique.mockResolvedValue(categoriaPadrao);

            const categoria =
                await categoriaService.recuperarCategoriaAcessivel(
                    '321-uuid',
                    categoriaPadrao.id,
                );

            expect(categoria.nome).toBe('LAZER');
        });

        it('lança erro quando a categoria não existe', async () => {
            mockPrisma.categoria.findUnique.mockResolvedValue(null);

            await expect(() =>
                categoriaService.recuperarCategoriaAcessivel(
                    '321-uuid',
                    'inexistente-uuid',
                ),
            ).rejects.toThrow('Categoria não existe');
        });

        it('lança erro quando a categoria é de outro usuário', async () => {
            mockPrisma.categoria.findUnique.mockResolvedValue(
                categoriaPersonalizada,
            );

            await expect(() =>
                categoriaService.recuperarCategoriaAcessivel(
                    '999-uuid',
                    categoriaPersonalizada.id,
                ),
            ).rejects.toThrow('Categoria não pertence a esse usuário');
        });
    });

    describe('Função: Atualizar categoria', () => {
        it('atualiza categoria com sucesso', async () => {
            mockPrisma.categoria.findUnique.mockResolvedValue(
                categoriaPersonalizada,
            );
            mockPrisma.categoria.findFirst.mockResolvedValue(null);
            mockPrisma.categoria.update.mockResolvedValue({
                ...categoriaPersonalizada,
                nome: 'Esportes',
            });

            const categoria = await categoriaService.atualizarCategoria(
                '321-uuid',
                categoriaPersonalizada.id,
                { nome: 'Esportes' },
            );

            expect(categoria.nome).toBe('Esportes');
        });

        it('lança erro ao alterar categoria padrão', async () => {
            mockPrisma.categoria.findUnique.mockResolvedValue(categoriaPadrao);

            await expect(() =>
                categoriaService.atualizarCategoria(
                    '321-uuid',
                    categoriaPadrao.id,
                    { nome: 'Diversão' },
                ),
            ).rejects.toThrow('Categorias padrão não podem ser alteradas');
            expect(mockPrisma.categoria.update).not.toHaveBeenCalled();
        });

        it('lança erro quando o novo nome já existe', async () => {
            mockPrisma.categoria.findUnique.mockResolvedValue(
                categoriaPersonalizada,
            );
            mockPrisma.categoria.findFirst.mockResolvedValue(categoriaPadrao);

            await expect(() =>
                categoriaService.atualizarCategoria(
                    '321-uuid',
                    categoriaPersonalizada.id,
                    { nome: 'LAZER' },
                ),
            ).rejects.toThrow('Categoria já existe');
        });
    });

    describe('Função: Deletar categoria', () => {
        it('move as despesas para OUTROS e deleta a categoria', async () => {
            mockPrisma.categoria.findUnique.mockResolvedValue(
                categoriaPersonalizada,
            );
            mockPrisma.categoria.findFirst.mockResolvedValue(categoriaOutros);

            const mensagem = await categoriaService.deletarCategoria(
                '321-uuid',
                categoriaPersonalizada.id,
            );

            expect(mensagem.message).toBe('Categoria deletada com sucesso');
            expect(mockPrisma.despesa.updateMany).toHaveBeenCalledWith({
                where: { idCategoria: categoriaPersonalizada.id },
                data: { idCategoria: categoriaOutros.id },
            });
            expect(mockPrisma.categoria.delete).toHaveBeenCalledWith({
                where: { id: categoriaPersonalizada.id },
            });
            expect(mockPrisma.$transaction).toHaveBeenCalledOnce();
        });

        it('lança erro ao deletar categoria padrão', async () => {
            mockPrisma.categoria.findUnique.mockResolvedValue(categoriaPadrao);

            await expect(() =>
                categoriaService.deletarCategoria(
                    '321-uuid',
                    categoriaPadrao.id,
                ),
            ).rejects.toThrow('Categorias padrão não podem ser alteradas');
            expect(mockPrisma.$transaction).not.toHaveBeenCalled();
        });

        it('lança erro ao deletar categoria de outro usuário', async () => {
            mockPrisma.categoria.findUnique.mockResolvedValue(
                categoriaPersonalizada,
            );

            await expect(() =>
                categoriaService.deletarCategoria(
                    '999-uuid',
                    categoriaPersonalizada.id,
                ),
            ).rejects.toThrow('Categoria não pertence a esse usuário');
        });
    });
});
