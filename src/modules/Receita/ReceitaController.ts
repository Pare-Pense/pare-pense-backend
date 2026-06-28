import { idSchema } from '../Schema.js';
import { usuarioService } from '../Usuario/UsuarioService.js';
import { periodoSchema } from './ReceitaSchema.js';
import { receitaService } from './ReceitaService.js';
import type { Request, Response } from 'express';

export class ReceitaController {
    private async usuarioExiste(id: string) {
        await usuarioService.recuperaUsuario(id);
    }

    async cadastrarReceita(req: Request, res: Response) {
        try {
            const { idUsuario } = req.body;

            await this.usuarioExiste(idUsuario);

            const receita = await receitaService.cadastrarReceita(req.body);

            res.status(201).json(receita);
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

    async recuperarReceitasAll(req: Request, res: Response) {
        try {
            const { idUsuario } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);

            await this.usuarioExiste(idUsuarioVerificado);

            const receitas =
                await receitaService.recuperarReceitasAll(idUsuarioVerificado);

            res.status(200).json(receitas);
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

    async recuperarReceitasPorPeriodo(req: Request, res: Response) {
        try {
            const { idUsuario, periodo } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);

            await this.usuarioExiste(idUsuarioVerificado);

            const periodoValidado = periodoSchema.parse(periodo);

            const receitas = await receitaService.recuperarReceitasPorPeriodo(
                idUsuarioVerificado,
                periodoValidado,
            );

            return res.status(200).json(receitas);
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

    async recuperarReceita(req: Request, res: Response) {
        try {
            const { idUsuario, idReceita } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idReceitaVerificado = idSchema.parse(idReceita);

            await this.usuarioExiste(idUsuarioVerificado);

            const receita = await receitaService.recuperarReceita(
                idUsuarioVerificado,
                idReceitaVerificado,
            );

            res.status(200).json(receita);
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

    async atualizarReceita(req: Request, res: Response) {
        try {
            const { idUsuario, idReceita } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idReceitaVerificado = idSchema.parse(idReceita);

            await this.usuarioExiste(idUsuarioVerificado);

            const receita = await receitaService.atualizaReceita(
                idUsuarioVerificado,
                idReceitaVerificado,
                req.body,
            );

            res.status(200).json(receita);
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

    async deletarReceita(req: Request, res: Response) {
        try {
            const { idUsuario, idReceita } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idReceitaVerificado = idSchema.parse(idReceita);

            await this.usuarioExiste(idUsuarioVerificado);

            const receita = await receitaService.deletarReceita(
                idUsuarioVerificado,
                idReceitaVerificado,
            );

            res.status(200).json(receita);
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
}
