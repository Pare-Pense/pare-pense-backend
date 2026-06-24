import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { ReceitaService } from './ReceitaService.js';
import { type PrismaClient, Prisma } from '../../generated/prisma/client.js';

describe('ReceitaService - Testes de Unidade', () => {
    const mockPrisma = mockDeep<PrismaClient>();

    const receitaService = new ReceitaService(mockPrisma);

    beforeEach(() => {
        mockReset(mockPrisma);
    });

    describe('Função: Cadastrar receita', () => {
        it('cadastra receita com sucesso', async () => {
            mockPrisma.receita.create.mockResolvedValue({
                id: '123-uuid',
                nome: 'Salário',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(3500),
                idUsuario: '321-uuid',
            });

            const receita = await receitaService.cadastrarReceita({
                nome: 'Salário',
                data: new Date('2026-05-18'),
                valor: 3500,
                idUsuario: '321-uuid',
            });

            expect(receita.nome).toBe('Salário');
            expect(receita.valor).toBe(3500);
            expect(mockPrisma.receita.create).toHaveBeenCalledOnce();
        });
    });

    describe('Função: Recuperar receitas', () => {
        it('recupera receitas do usuário com sucesso', async () => {
            mockPrisma.receita.findMany.mockResolvedValue([
                {
                    id: '123-uuid',
                    nome: 'Salário',
                    data: new Date('2026-05-18'),
                    valor: new Prisma.Decimal(3500),
                    idUsuario: '321-uuid',
                },
            ]);

            const receitas =
                await receitaService.recuperarReceitasAll('321-uuid');

            expect(receitas.length).toBe(1);
            expect(mockPrisma.receita.findMany).toHaveBeenCalledOnce();
        });

        it('recupera receita do usuário com sucesso', async () => {
            mockPrisma.receita.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Salário',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(3500),
                idUsuario: '321-uuid',
            });

            const receita = await receitaService.recuperarReceita(
                '321-uuid',
                '123-uuid',
            );

            expect(receita.nome).toBe('Salário');
            expect(mockPrisma.receita.findUnique).toHaveBeenCalledOnce();
        });

        it('lança erro quando a receita não existe', async () => {
            mockPrisma.receita.findUnique.mockResolvedValue(null);

            await expect(() =>
                receitaService.recuperarReceita('321-uuid', '123-uuid'),
            ).rejects.toThrow('Receita não existe');
        });

        it('lança erro quando a receita não pertence ao usuário', async () => {
            mockPrisma.receita.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Salário',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(3500),
                idUsuario: '321-uuid',
            });

            await expect(() =>
                receitaService.recuperarReceita('999-uuid', '123-uuid'),
            ).rejects.toThrow('Receita não pertence a esse usuário');
        });
    });

    describe('Função: Atualizar receita', () => {
        it('atualiza receita do usuário com sucesso', async () => {
            mockPrisma.receita.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Salário',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(3500),
                idUsuario: '321-uuid',
            });

            mockPrisma.receita.update.mockResolvedValue({
                id: '123-uuid',
                nome: 'Freelance',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(4200),
                idUsuario: '321-uuid',
            });

            const receita = await receitaService.atualizaReceita(
                '321-uuid',
                '123-uuid',
                {
                    nome: 'Freelance',
                    data: new Date('2026-05-18'),
                    valor: 4200,
                    idUsuario: '321-uuid',
                },
            );

            expect(receita.nome).toBe('Freelance');
            expect(receita.valor).toBe(4200);
            expect(mockPrisma.receita.update).toHaveBeenCalledOnce();
        });

        it('lança erro quando a receita não existe', async () => {
            mockPrisma.receita.findUnique.mockResolvedValue(null);

            await expect(() =>
                receitaService.atualizaReceita('321-uuid', '123-uuid', {
                    nome: 'Freelance',
                    data: new Date('2026-05-18'),
                    valor: 4200,
                    idUsuario: '321-uuid',
                }),
            ).rejects.toThrow('Receita não existe');
        });

        it('lança erro quando a receita não pertence ao usuário', async () => {
            mockPrisma.receita.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Salário',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(3500),
                idUsuario: '321-uuid',
            });

            await expect(() =>
                receitaService.atualizaReceita('999-uuid', '123-uuid', {
                    nome: 'Freelance',
                    data: new Date('2026-05-18'),
                    valor: 4200,
                    idUsuario: '321-uuid',
                }),
            ).rejects.toThrow('Receita não pertence a esse usuário');
        });
    });

    describe('Função: Deletar receita', () => {
        it('deleta receita do usuário com sucesso', async () => {
            mockPrisma.receita.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Salário',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(3500),
                idUsuario: '321-uuid',
            });

            const mensagem = await receitaService.deletarReceita(
                '321-uuid',
                '123-uuid',
            );

            expect(mensagem.message).toBe('Receita deletada com sucesso');
        });

        it('lança erro quando a receita não existe', async () => {
            mockPrisma.receita.findUnique.mockResolvedValue(null);

            await expect(() =>
                receitaService.deletarReceita('321-uuid', '123-uuid'),
            ).rejects.toThrow('Receita não existe');
        });

        it('lança erro quando a receita não pertence ao usuário', async () => {
            mockPrisma.receita.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Salário',
                data: new Date('2026-05-18'),
                valor: new Prisma.Decimal(3500),
                idUsuario: '321-uuid',
            });

            await expect(() =>
                receitaService.deletarReceita('999-uuid', '123-uuid'),
            ).rejects.toThrow('Receita não pertence a esse usuário');
        });
    });
});
