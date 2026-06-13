import type { Request, Response } from 'express';
import { usuarioService } from './UsuarioService.js';
import { idSchema } from '../Schema.js';

export class UsuarioController {
    async criarUsuario(req: Request, res: Response) {
        try {
            const usuario = await usuarioService.criarUsuario(req.body);

            res.status(201).json(usuario);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ erro: error.message });
                return;
            }

            res.status(500).json({
                erro: 'Ocorreu um erro desconhecido no servidor',
            });
        }
    }

    async recuperaUsuario(req: Request, res: Response) {
        try {
            const id = idSchema.parse(req.params.id);

            const usuario = await usuarioService.recuperaUsuario(id);

            res.status(200).json(usuario);
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === 'Usuário não encontrado') {
                    res.status(404).json({ erro: error.message });
                    return;
                }

                res.status(400).json({ erro: error.message });
                return;
            }

            res.status(500).json({
                erro: 'Ocorreu um erro desconhecido no servidor',
            });
        }
    }

    async atualizaUsuario(req: Request, res: Response) {
        try {
            const id = idSchema.parse(req.params.id);

            const usuario = await usuarioService.atualizaUsuario(id, req.body);

            res.status(200).json(usuario);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ erro: error.message });
                return;
            }

            res.status(500).json({
                erro: 'Ocorreu um erro desconhecido no servidor',
            });
        }
    }

    async atualizaSenhaUsuario(req: Request, res: Response) {
        try {
            const id = idSchema.parse(req.params.id);

            const mensagem = await usuarioService.atualizaSenhaUsuario(
                id,
                req.body,
            );

            res.status(200).json(mensagem);
        } catch (error: unknown) {
            if (error instanceof Error) {
                const status = error.message.includes('incorreta') ? 401 : 400;

                res.status(status).json({ erro: error.message });
                return;
            }

            res.status(500).json({
                erro: 'Ocorreu um erro desconhecido no servidor',
            });
        }
    }

    async deletaUsuario(req: Request, res: Response) {
        try {
            const id = idSchema.parse(req.params.id);

            const message = await usuarioService.deletarUsuario(id);

            res.status(200).json(message);
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === 'Usuário não encontrado') {
                    res.status(404).json({ erro: error.message });
                    return;
                }

                res.status(400).json({ erro: error.message });
                return;
            }

            res.status(500).json({
                erro: 'Ocorreu um erro desconhecido no servidor',
            });
        }
    }

    async loginUsuario(req: Request, res: Response) {
        try {
            const body = await usuarioService.loginUsuario(req.body);

            res.status(200).json(body);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ erro: error.message });
                return;
            }

            res.status(500).json({
                erro: 'Ocorreu um erro desconhecido no servidor',
            });
        }
    }
}
