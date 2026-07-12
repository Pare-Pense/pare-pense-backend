import type { Request, Response } from 'express';
import { usuarioService } from '../Usuario/UsuarioService.js';
import { notificacaoService } from './NotificacaoService.js';
import { idSchema } from '../Schema.js';

export class NotificacaoController {
    private async usuarioExiste(id: string) {
        await usuarioService.recuperaUsuario(id);
    }

    async recuperarNotificacoes(req: Request, res: Response) {
        try {
            const { idUsuario } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);

            await this.usuarioExiste(idUsuarioVerificado);

            const resultado = await notificacaoService.recuperarNotificacoes(
                idUsuarioVerificado,
            );

            return res.status(200).json(resultado);
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === 'Usuário não encontrado') {
                    return res.status(404).json({ erro: error.message });
                }

                return res.status(400).json({ erro: error.message });
            }

            return res.status(500).json({
                erro: 'Ocorreu um erro desconhecido no servidor',
            });
        }
    }

    async marcarComoLida(req: Request, res: Response) {
        try {
            const { idUsuario, idNotificacao } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idNotificacaoVerificado = idSchema.parse(idNotificacao);

            await this.usuarioExiste(idUsuarioVerificado);

            const notificacao = await notificacaoService.marcarComoLida(
                idUsuarioVerificado,
                idNotificacaoVerificado,
            );

            return res.status(200).json(notificacao);
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === 'Usuário não encontrado') {
                    return res.status(404).json({ erro: error.message });
                }

                return res.status(400).json({ erro: error.message });
            }

            return res.status(500).json({
                erro: 'Ocorreu um erro desconhecido no servidor',
            });
        }
    }

    async marcarTodasComoLidas(req: Request, res: Response) {
        try {
            const { idUsuario } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);

            await this.usuarioExiste(idUsuarioVerificado);

            const resultado =
                await notificacaoService.marcarTodasComoLidas(
                    idUsuarioVerificado,
                );

            return res.status(200).json(resultado);
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === 'Usuário não encontrado') {
                    return res.status(404).json({ erro: error.message });
                }

                return res.status(400).json({ erro: error.message });
            }

            return res.status(500).json({
                erro: 'Ocorreu um erro desconhecido no servidor',
            });
        }
    }
}