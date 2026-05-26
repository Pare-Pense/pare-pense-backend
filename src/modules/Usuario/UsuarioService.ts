import { prisma } from '../../lib/prisma.js';
import type { AtualizaSenhaSchema, UsuarioSchema } from './UsuarioSchema.js';
import bcrypt from 'bcrypt';

export class UsuarioService {
    constructor(private db = prisma) {}

    async criarUsuario(usuario: UsuarioSchema) {
        const emailExiste = await this.db.usuario.findUnique({
            where: { email: usuario.email },
        });

        if (emailExiste) {
            throw new Error('Este e-mail já está em uso.');
        }

        const senhaHashed = await bcrypt.hash(usuario.senha, 10);

        const novoUsuario = await this.db.usuario.create({
            data: {
                nome: usuario.nome,
                dataNascimento: usuario.dataNascimento,
                email: usuario.email,
                senha: senhaHashed,
                rendaMensal: usuario.rendaMensal,
                limiteMensal: usuario.limiteMensal,
            },
        });

        const { senha: _, ...usuarioSemSenha } = novoUsuario;

        return {
            ...usuarioSemSenha,
            rendaMensal: usuarioSemSenha.rendaMensal.toNumber(),
            limiteMensal: usuarioSemSenha.limiteMensal.toNumber(),
        };
    }

    async recuperaUsuario(id: string) {
        const usuario = await this.db.usuario.findUnique({
            where: { id },
        });

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const { senha: _, ...usuarioSemSenha } = usuario;

        return {
            ...usuarioSemSenha,
            rendaMensal: usuarioSemSenha.rendaMensal.toNumber(),
            limiteMensal: usuarioSemSenha.limiteMensal.toNumber(),
        };
    }

    async atualizaUsuario(id: string, data: UsuarioSchema) {
        await this.recuperaUsuario(id);

        if (data.email) {
            const emailExiste = await this.db.usuario.findUnique({
                where: { email: data.email },
            });

            if (emailExiste && emailExiste.id !== id) {
                throw new Error('Este e-mail já está em uso por outro usuário');
            }
        }

        const usuarioAtualizado = await this.db.usuario.update({
            where: { id },
            data,
        });

        const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;

        return {
            ...usuarioSemSenha,
            rendaMensal: usuarioSemSenha.rendaMensal.toNumber(),
            limiteMensal: usuarioSemSenha.limiteMensal.toNumber(),
        };
    }

    async atualizaSenhaUsuario(id: string, data: AtualizaSenhaSchema) {
        const usuario = await this.db.usuario.findUnique({
            where: { id },
        });

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const senhaValida = await bcrypt.compare(
            data.senhaAntiga,
            usuario.senha,
        );

        if (!senhaValida) {
            throw new Error('A senha atual está incorreta');
        }

        const novaSenhaHashed = await bcrypt.hash(data.senhaNova, 10);

        await this.db.usuario.update({
            where: { id },
            data: { senha: novaSenhaHashed },
        });

        return { message: 'Senha atualizada com sucesso' };
    }

    async deletarUsuario(id: string) {
        await this.recuperaUsuario(id);

        await this.db.usuario.delete({ where: { id } });

        return { message: 'Usuário deletado com sucesso.' };
    }
}
