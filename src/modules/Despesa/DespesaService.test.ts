import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { DespesaService } from './DespesaService.js';
import {
    type Categoria,
    type PrismaClient,
    Prisma,
} from '../../generated/prisma/client.js';

const categoriaAlimentacao: Categoria = {
    id: 'cat-alimentacao-uuid',
    nome: 'ALIMENTACAO',
    idUsuario: null,
};

const categoriaLazer: Categoria = {
    id: 'cat-lazer-uuid',
    nome: 'LAZER',
    idUsuario: null,
};

const criaDespesaMock = (
    categoria: Categoria = categoriaAlimentacao,
    valor = 51.8,
) => ({
    id: '123-uuid',
    nome: 'Delivery',
    idCategoria: categoria.id,
    categoria,
    data: new Date('2026-05-18'),
    valor: new Prisma.Decimal(valor),
    idUsuario: '321-uuid',
    idDespesaRecorrente: null,
});

describe('DespesaService - Testes de Unidade', () => {
    const mockPrisma = mockDeep<PrismaClient>();

    const despesaService = new DespesaService(mockPrisma);

    beforeEach(() => {
        mockReset(mockPrisma);
    });

    describe('Função: Cadastrar despesa', () => {
        it('cadastra despesa com sucesso', async () => {
            mockPrisma.categoria.findUnique.mockResolvedValue(
                categoriaAlimentacao,
            );
            mockPrisma.despesa.create.mockResolvedValue(
                criaDespesaMock(categoriaAlimentacao, 51.01),
            );

            const despesa = await despesaService.cadastrarDespesa({
                nome: 'Delivery',
                idCategoria: categoriaAlimentacao.id,
                data: new Date('2026-05-18'),
                valor: 51.99,
                idUsuario: '321-uuid',
            });

            expect(despesa.nome).toBe('Delivery');
            expect(despesa.valor).toBe(51.01);
            expect(despesa.categoria).toBe('ALIMENTACAO');
            expect(despesa.idCategoria).toBe(categoriaAlimentacao.id);
            expect(mockPrisma.despesa.create).toHaveBeenCalledOnce();
        });

        it('cadastra despesa com categoria personalizada do usuário', async () => {
            const categoriaPersonalizada = {
                id: 'cat-academia-uuid',
                nome: 'Academia',
                idUsuario: '321-uuid',
            };
            mockPrisma.categoria.findUnique.mockResolvedValue(
                categoriaPersonalizada,
            );
            mockPrisma.despesa.create.mockResolvedValue(
                criaDespesaMock(categoriaPersonalizada),
            );

            const despesa = await despesaService.cadastrarDespesa({
                nome: 'Mensalidade',
                idCategoria: categoriaPersonalizada.id,
                data: new Date('2026-05-18'),
                valor: 100,
                idUsuario: '321-uuid',
            });

            expect(despesa.categoria).toBe('Academia');
        });

        it('lança erro quando a categoria não existe', async () => {
            mockPrisma.categoria.findUnique.mockResolvedValue(null);

            await expect(() =>
                despesaService.cadastrarDespesa({
                    nome: 'Delivery',
                    idCategoria: 'inexistente-uuid',
                    data: new Date('2026-05-18'),
                    valor: 51.99,
                    idUsuario: '321-uuid',
                }),
            ).rejects.toThrow('Categoria não existe');
            expect(mockPrisma.despesa.create).not.toHaveBeenCalled();
        });

        it('lança erro quando a categoria é de outro usuário', async () => {
            mockPrisma.categoria.findUnique.mockResolvedValue({
                id: 'cat-outro-uuid',
                nome: 'Academia',
                idUsuario: '999-uuid',
            });

            await expect(() =>
                despesaService.cadastrarDespesa({
                    nome: 'Delivery',
                    idCategoria: 'cat-outro-uuid',
                    data: new Date('2026-05-18'),
                    valor: 51.99,
                    idUsuario: '321-uuid',
                }),
            ).rejects.toThrow('Categoria não pertence a esse usuário');
            expect(mockPrisma.despesa.create).not.toHaveBeenCalled();
        });
    });

    describe('Função: Recuperar despesas', () => {
        it('recupera despesas do usuário com sucesso', async () => {
            mockPrisma.despesa.findMany.mockResolvedValue([criaDespesaMock()]);

            const despesas =
                await despesaService.recuperarDespesasAll('321-uuid');

            expect(despesas.length).toBe(1);
            expect(despesas[0]?.categoria).toBe('ALIMENTACAO');
            expect(mockPrisma.despesa.findMany).toHaveBeenCalledOnce();
        });

        it('recupera despesa do usuário com sucesso', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue(criaDespesaMock());

            const despesa = await despesaService.recuperarDespesa(
                '321-uuid',
                '123-uuid',
            );

            expect(despesa.nome).toBe('Delivery');
            expect(mockPrisma.despesa.findUnique).toHaveBeenCalledOnce();
        });

        it('lança erro quando a despesa não existe', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue(null);

            await expect(() =>
                despesaService.recuperarDespesa('321-uuid', '123-uuid'),
            ).rejects.toThrow('Despesa não existe');
        });

        it('lança erro quando a despesa não é do usuário', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue(criaDespesaMock());

            await expect(() =>
                despesaService.recuperarDespesa('324-uuid', '123-uuid'),
            ).rejects.toThrow('Despesa não pertence a esse usuário');
        });
    });

    describe('Função: Atualizar despesa', () => {
        it('atualiza despesa do usuário com sucesso', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue(criaDespesaMock());
            mockPrisma.categoria.findUnique.mockResolvedValue(categoriaLazer);
            mockPrisma.despesa.update.mockResolvedValue(
                criaDespesaMock(categoriaLazer, 58),
            );

            const despesa = await despesaService.atualizaDespesa(
                '321-uuid',
                '123-uuid',
                {
                    nome: 'Delivery',
                    idCategoria: categoriaLazer.id,
                    data: new Date('2026-05-18'),
                    valor: 58,
                    idUsuario: '321-uuid',
                },
            );

            expect(despesa.categoria).toBe('LAZER');
            expect(despesa.valor).toBe(58);
            expect(mockPrisma.despesa.findUnique).toHaveBeenCalledOnce();
            expect(mockPrisma.categoria.findUnique).toHaveBeenCalledOnce();
        });

        it('lança erro quando a despesa não existe', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue(null);

            await expect(() =>
                despesaService.atualizaDespesa('321-uuid', '123-uuid', {
                    nome: 'Delivery',
                    idCategoria: categoriaLazer.id,
                    data: new Date('2026-05-18'),
                    valor: 58,
                    idUsuario: '321-uuid',
                }),
            ).rejects.toThrow('Despesa não existe');
        });

        it('lança erro quando a despesa não é do usuário', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue(criaDespesaMock());

            await expect(() =>
                despesaService.atualizaDespesa('324-uuid', '123-uuid', {
                    nome: 'Delivery',
                    idCategoria: categoriaLazer.id,
                    data: new Date('2026-05-18'),
                    valor: 58,
                    idUsuario: '321-uuid',
                }),
            ).rejects.toThrow('Despesa não pertence a esse usuário');
        });

        it('lança erro quando a nova categoria é de outro usuário', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue(criaDespesaMock());
            mockPrisma.categoria.findUnique.mockResolvedValue({
                id: 'cat-outro-uuid',
                nome: 'Academia',
                idUsuario: '999-uuid',
            });

            await expect(() =>
                despesaService.atualizaDespesa('321-uuid', '123-uuid', {
                    nome: 'Delivery',
                    idCategoria: 'cat-outro-uuid',
                    data: new Date('2026-05-18'),
                    valor: 58,
                    idUsuario: '321-uuid',
                }),
            ).rejects.toThrow('Categoria não pertence a esse usuário');
            expect(mockPrisma.despesa.update).not.toHaveBeenCalled();
        });
    });

    describe('Função: Deletar despesa', () => {
        it('deleta despesa do usuário com sucesso', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue(criaDespesaMock());

            const mensagem = await despesaService.deletarDespesa(
                '321-uuid',
                '123-uuid',
            );

            expect(mensagem.message).toBe('Despesa deletada com sucesso');
        });

        it('lança erro quando a despesa não existe', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue(null);

            await expect(() =>
                despesaService.deletarDespesa('321-uuid', '123-uuid'),
            ).rejects.toThrow('Despesa não existe');
        });

        it('lança erro quando a despesa não é do usuário', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue(criaDespesaMock());

            await expect(() =>
                despesaService.deletarDespesa('324-uuid', '123-uuid'),
            ).rejects.toThrow('Despesa não pertence a esse usuário');
        });
    });
});
