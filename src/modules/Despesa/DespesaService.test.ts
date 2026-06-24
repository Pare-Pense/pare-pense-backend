import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { DespesaService } from './DespesaService.js';
import { type PrismaClient, Prisma } from '../../generated/prisma/client.js';

describe('DespesaService - Testes de Unidade', () => {
    const mockPrisma = mockDeep<PrismaClient>();

    const despesaService = new DespesaService(mockPrisma);

    beforeEach(() => {
        mockReset(mockPrisma);
    });

    describe('Função: Cadastrar despesa', () => {
        it('cadastra despesa com sucesso', async () => {
            mockPrisma.despesa.create.mockResolvedValue({
                id: '123-uuid',
                nome: 'Delivery',
                categoria: 'ALIMENTACAO',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(51.01),
                idUsuario: '321-uuid',
            });

            const despesa = await despesaService.cadastrarDespesa({
                nome: 'Delivery',
                categoria: 'ALIMENTACAO',
                data: new Date('2026-05-18'),
                valor: 51.99,
                idUsuario: '321-uuid',
            });

            expect(despesa.nome).toBe('Delivery');
            expect(despesa.valor).toBe(51.01);
            expect(mockPrisma.despesa.create).toHaveBeenCalledOnce();
        });
    });

    describe('Função: Recuperar despesas', () => {
        it('recupera despesas do usuário com sucesso', async () => {
            mockPrisma.despesa.findMany.mockResolvedValue([
                {
                    id: '123-uuid',
                    nome: 'Delivery',
                    categoria: 'ALIMENTACAO',
                    data: new Date('2026-05-18'),
                    valor: new Prisma.Decimal(51.8),
                    idUsuario: '321-uuid',
                },
            ]);

            const despesas =
                await despesaService.recuperarDespesasAll('321-uuid');

            expect(despesas.length).toBe(1);
            expect(mockPrisma.despesa.findMany).toHaveBeenCalledOnce();
        });

        it('recupera despesa do usuário com sucesso', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Delivery',
                categoria: 'ALIMENTACAO',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(51.8),
                idUsuario: '321-uuid',
            });

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
            mockPrisma.despesa.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Delivery',
                categoria: 'ALIMENTACAO',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(51.8),
                idUsuario: '321-uuid',
            });

            await expect(() =>
                despesaService.recuperarDespesa('324-uuid', '123-uuid'),
            ).rejects.toThrow('Despesa não pertence a esse usuário');
        });
    });

    describe('Função: Atualizar despesa', () => {
        it('atualiza despesa do usuário com sucesso', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Delivery',
                categoria: 'ALIMENTACAO',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(51.8),
                idUsuario: '321-uuid',
            });

            mockPrisma.despesa.update.mockResolvedValue({
                id: '123-uuid',
                nome: 'Delivery',
                categoria: 'LAZER',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(58),
                idUsuario: '321-uuid',
            });

            const despesa = await despesaService.atualizaDespesa(
                '321-uuid',
                '123-uuid',
                {
                    nome: 'Delivery',
                    categoria: 'LAZER',
                    data: new Date('2026-05-18'),
                    valor: 58,
                    idUsuario: '321-uuid',
                },
            );

            expect(despesa.categoria).toBe('LAZER');
            expect(despesa.valor).toBe(58);
            expect(mockPrisma.despesa.findUnique).toHaveBeenCalledOnce();
        });

        it('lança erro quando a despesa não existe', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue(null);

            await expect(() =>
                despesaService.atualizaDespesa('321-uuid', '123-uuid', {
                    nome: 'Delivery',
                    categoria: 'LAZER',
                    data: new Date('2026-05-18'),
                    valor: 58,
                    idUsuario: '321-uuid',
                }),
            ).rejects.toThrow('Despesa não existe');
        });

        it('lança erro quando a despesa não é do usuário', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Delivery',
                categoria: 'ALIMENTACAO',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(51.8),
                idUsuario: '321-uuid',
            });

            await expect(() =>
                despesaService.atualizaDespesa('324-uuid', '123-uuid', {
                    nome: 'Delivery',
                    categoria: 'LAZER',
                    data: new Date('2026-05-18'),
                    valor: 58,
                    idUsuario: '321-uuid',
                }),
            ).rejects.toThrow('Despesa não pertence a esse usuário');
        });
    });

    describe('Função: Deletar despesa', () => {
        it('deleta despesa do usuário com sucesso', async () => {
            mockPrisma.despesa.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Delivery',
                categoria: 'ALIMENTACAO',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(51.8),
                idUsuario: '321-uuid',
            });

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
            mockPrisma.despesa.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Delivery',
                categoria: 'ALIMENTACAO',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(51.8),
                idUsuario: '321-uuid',
            });

            await expect(() =>
                despesaService.deletarDespesa('324-uuid', '123-uuid'),
            ).rejects.toThrow('Despesa não pertence a esse usuário');
        });
    });
});
