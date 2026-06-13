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
        it('fluxo de criação de um usuário com sucesso e sem retorno da senha', async () => {
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
        it('fluxo de recuperação do usuário com sucesso e sem retorno da senha', async () => {
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
        it('fluxo de atualização do usuário (limite mensal) e sem retorno da senha', async () => {
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

        it('lança erro ao tentar alterar o e-mail para um que já existe', async () => {
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

            mockPrisma.usuario.findUnique.mockResolvedValue({
                id: '124-uuid',
                nome: 'Teste1',
                email: 'teste1@teste.com',
                senha: 'hash-da-senha',
                rendaMensal: new Prisma.Decimal(5000),
                limiteMensal: new Prisma.Decimal(2000),
                dataNascimento: new Date('1990-01-01'),
                createdAt: new Date(),
            });

            await expect(() =>
                usuarioService.atualizaUsuario('123-uuid', {
                    nome: 'Teste',
                    email: 'teste1@teste.com',
                    senha: '12345678',
                    rendaMensal: 5000,
                    limiteMensal: 2000,
                    dataNascimento: new Date('1990-01-01'),
                }),
            ).rejects.toThrow('Este e-mail já está em uso por outro usuário');
        });
    });

    describe('Função: Atualizar senha usuário', () => {
        it('fluxo de atualização da senha', async () => {
            mockPrisma.usuario.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Teste',
                email: 'teste@teste.com',
                senha: '$2a$10$fFY8Eu3nUqH5x2G1kRsKpObwmbNxldZDgUv10V5o87Yu2oIg4AAQq',
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

            const mensagem = await usuarioService.atualizaSenhaUsuario(
                '123-uuid',
                {
                    senhaAntiga: '12345678',
                    senhaNova: '123456789',
                },
            );

            expect(mensagem.message, 'Senha atualizada com sucesso');
        });

        it('lança erro ao não encontrar o usuário', async () => {
            mockPrisma.usuario.findUnique.mockResolvedValue(null);

            await expect(
                usuarioService.atualizaSenhaUsuario('124-uuid', {
                    senhaAntiga: '12345678',
                    senhaNova: '123456789',
                }),
            ).rejects.toThrow('Usuário não encontrado');
        });

        it('lança erro por senha atual incorreta', async () => {
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

            await expect(
                usuarioService.atualizaSenhaUsuario('124-uuid', {
                    senhaAntiga: '12345678',
                    senhaNova: '123456789',
                }),
            ).rejects.toThrow('A senha atual está incorreta');
        });
    });

    describe('Função: Deletar usuário', () => {
        it('fluxo de deleção de usuário', async () => {
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

            mockPrisma.usuario.delete.mockResolvedValue({
                id: '123-uuid',
                nome: 'Teste',
                email: 'teste@teste.com',
                senha: 'hash-da-senha',
                rendaMensal: new Prisma.Decimal(5000),
                limiteMensal: new Prisma.Decimal(2000),
                dataNascimento: new Date('1990-01-01'),
                createdAt: new Date(),
            });

            const mensagem = await usuarioService.deletarUsuario('123-uuid');

            expect(mensagem.message, 'Usuário deletado com sucesso.');
        });

        it('lança erro ao não encontrar o usuário', async () => {
            mockPrisma.usuario.findUnique.mockResolvedValue(null);

            await expect(
                usuarioService.deletarUsuario('124-uuid'),
            ).rejects.toThrow('Usuário não encontrado');
        });
    });

    describe('Função: Login usuário', () => {
        it('fluxo de login de usuário', async () => {
            mockPrisma.usuario.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Teste',
                email: 'teste@teste.com',
                senha: '$2a$10$fFY8Eu3nUqH5x2G1kRsKpObwmbNxldZDgUv10V5o87Yu2oIg4AAQq',
                rendaMensal: new Prisma.Decimal(5000),
                limiteMensal: new Prisma.Decimal(2000),
                dataNascimento: new Date('1990-01-01'),
                createdAt: new Date(),
            });

            const body = await usuarioService.loginUsuario({
                email: 'teste@teste.com',
                senha: '12345678',
            });

            expect(body.token).toBeDefined();
        });

        it('lança erro ao não encontrar usuário', async () => {
            mockPrisma.usuario.findUnique.mockResolvedValue(null);

            await expect(
                usuarioService.loginUsuario({
                    email: 'teste@teste.com',
                    senha: '12345678',
                }),
            ).rejects.toThrow('Usuário não encontrado');
        });

        it('lança erro ao senha incorreta', async () => {
            mockPrisma.usuario.findUnique.mockResolvedValue({
                id: '123-uuid',
                nome: 'Teste',
                email: 'teste@teste.com',
                senha: '$2a$10$fFY8Eu3nUqH5x2G1kRsKpObwmbNxldZDgUv10V5o87Yu2oIg4AAQq',
                rendaMensal: new Prisma.Decimal(5000),
                limiteMensal: new Prisma.Decimal(2000),
                dataNascimento: new Date('1990-01-01'),
                createdAt: new Date(),
            });

            await expect(
                usuarioService.loginUsuario({
                    email: 'teste@teste.com',
                    senha: 'senha_errada',
                }),
            ).rejects.toThrow('Senha inválida');
        });
    });
});
