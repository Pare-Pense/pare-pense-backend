import { describe, it, expect, beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { UsuarioService } from './UsuarioService.js';
import { type PrismaClient, Prisma } from '../../generated/prisma/client.js';

describe('UsuarioService - Testes de Unidade', () => {
    const mockPrisma = mockDeep<PrismaClient>();

    const usuarioService = new UsuarioService(mockPrisma);

    beforeEach(() => {
        mockReset(mockPrisma);
    });

    describe('Função: Criar usuário', () => {
        it('cria um usuário com sucesso e não retorna a senha', async () => {
            mockPrisma.usuario.findUnique.mockResolvedValue(null);

            mockPrisma.usuario.create.mockResolvedValue({
                id: '123-uuid',
                nome: 'Teste',
                email: 'teste@teste.com',
                senha: 'hash-da-senha',
                rendaMensal: new Prisma.Decimal(5000),
                limiteMensal: new Prisma.Decimal(2000),
                dataNascimento: new Date('1990-01-01'),
                createdAt: new Date(),
            });

            const usuario = await usuarioService.criarUsuario({
                nome: 'Teste',
                email: 'teste@teste.com',
                senha: '12345678',
                rendaMensal: 5000,
                limiteMensal: 2000,
                dataNascimento: new Date('1990-01-01'),
            });

            expect(usuario.nome).toBe('Teste');
            expect(usuario).not.toHaveProperty('senha');
            expect(mockPrisma.usuario.create).toHaveBeenCalledOnce();
        });

        it('lança um erro pelo email já estar em uso', async () => {
            mockPrisma.usuario.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Teste',
                email: 'teste@teste.com',
                senha: 'hash-da-senha',
                rendaMensal: new Prisma.Decimal(5000),
                limiteMensal: new Prisma.Decimal(2000),
                dataNascimento: new Date('1990-01-01'),
                createdAt: new Date(),
            });

            await expect(() =>
                usuarioService.criarUsuario({
                    nome: 'Teste',
                    email: 'teste@teste.com',
                    senha: '12345678',
                    rendaMensal: 5000,
                    limiteMensal: 2000,
                    dataNascimento: new Date('1990-01-01'),
                }),
            ).rejects.toThrow('Este e-mail já está em uso.');

            expect(mockPrisma.usuario.create).not.toHaveBeenCalled();
        });
    });

    describe('Função: Recuperar usuário', () => {
        it('recupera o usuário com sucesso e sem retornar a senha', async () => {
            mockPrisma.usuario.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Teste',
                email: 'teste@teste.com',
                senha: 'hash-da-senha',
                rendaMensal: new Prisma.Decimal(5000),
                limiteMensal: new Prisma.Decimal(2000),
                dataNascimento: new Date('1990-01-01'),
                createdAt: new Date(),
            });

            const usuario = await usuarioService.recuperaUsuario('123-uuid');

            expect(usuario.nome).toBe('Teste');
            expect(usuario).not.toHaveProperty('senha');
            expect(usuario.rendaMensal).toBe(5000);
        });

        it('lança erro quando o usuário não foi encontrado', async () => {
            mockPrisma.usuario.findUnique.mockResolvedValue(null);

            await expect(() =>
                usuarioService.recuperaUsuario('123-uuid'),
            ).rejects.toThrow('Usuário não encontrado');
        });
    });

    describe('Função: Atualizar usuário', () => {
        it('atualiza limite mensal do usuário e sem retornar a senha', async () => {
            mockPrisma.usuario.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Teste',
                email: 'teste@teste.com',
                senha: 'hash-da-senha',
                rendaMensal: new Prisma.Decimal(5000),
                limiteMensal: new Prisma.Decimal(2000),
                dataNascimento: new Date('1990-01-01'),
                createdAt: new Date(),
            });

            mockPrisma.usuario.update.mockResolvedValue({
                id: '123-uuid',
                nome: 'Teste',
                email: 'teste@teste.com',
                senha: 'hash-da-senha',
                rendaMensal: new Prisma.Decimal(5000),
                limiteMensal: new Prisma.Decimal(4000),
                dataNascimento: new Date('1990-01-01'),
                createdAt: new Date(),
            });

            const usuario = await usuarioService.atualizaUsuario('123-uuid', {
                nome: 'Teste',
                email: 'teste@teste.com',
                senha: '12345678',
                rendaMensal: 5000,
                limiteMensal: 4000,
                dataNascimento: new Date('1990-01-01'),
            });

            expect(usuario.limiteMensal).toBe(4000);
            expect(usuario).not.toHaveProperty('senha');
        });
    });
});
