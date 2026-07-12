import type { Notificacao } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';

export class NotificacaoService {
    constructor(private db = prisma) {}

    // Ajustar 
    private formataNotificacao(notificacao: Notificacao) {
        return notificacao;
    }

    async cadastrarNotificacao(data: {
        titulo: string;
        mensagem: string;
        idUsuario: string;
    }) {
        const notificacao = await this.db.notificacao.create({
            data,
        });

        return this.formataNotificacao(notificacao);
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
            notificacoes: notificacoes.map((notificacao) => this.formataNotificacao(notificacao)),
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

        return this.formataNotificacao(notificacao);
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

        return this.formataNotificacao(notificacao);
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