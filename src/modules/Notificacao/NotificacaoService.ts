import type { Notificacao } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';

export class NotificacaoService {
    constructor(private db = prisma) {}

    async cadastrarNotificacao(data: {
        titulo: string;
        mensagem: string;
        idUsuario: string;
    }) {
        const notificacao = await this.db.notificacao.create({
            data,
        });

        return notificacao;
    }

    async recuperarNotificacoes(idUsuario: string) {
        const notificacoes = await this.db.notificacao.findMany({
            where: {
                idUsuario,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const naoLidas = await this.db.notificacao.count({
            where: {
                idUsuario,
                lida: false,
            },
        });

        return {
            notificacoes,
            naoLidas,
        };
    }

    async recuperarNotificacao(idUsuario: string, idNotificacao: string) {
        const notificacao = await this.db.notificacao.findUnique({
            where: {
                id: idNotificacao,
            },
        });

        if (!notificacao) {
            throw new Error('Notificação não existe');
        }

        if (notificacao.idUsuario !== idUsuario) {
            throw new Error('Notificação não pertence a esse usuário');
        }

        return notificacao;
    }

    async marcarComoLida(idUsuario: string, idNotificacao: string) {
        await this.recuperarNotificacao(idUsuario, idNotificacao);

        const notificacao = await this.db.notificacao.update({
            where: {
                id: idNotificacao,
            },
            data: {
                lida: true,
            },
        });

        return notificacao;
    }

    async marcarTodasComoLidas(idUsuario: string) {
        return this.db.notificacao.updateMany({
            where: {
                idUsuario,
                lida: false,
            },
            data: {
                lida: true,
            },
        });
    }
}

export const notificacaoService = new NotificacaoService();