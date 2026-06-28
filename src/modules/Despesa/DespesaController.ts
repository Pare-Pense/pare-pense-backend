import type { Request, Response } from 'express';
import { despesaService } from './DespesaService.js';
import { usuarioService } from '../Usuario/UsuarioService.js';
import { idSchema } from '../Schema.js';
import { periodoSchema, validaCategoria } from './DespesaSchema.js';
import type { Categoria } from '../../generated/prisma/enums.js';

export class DespesaController {
    
    private async usuarioExiste(id: string) {
        await usuarioService.recuperaUsuario(id);
    }

    async cadastrarDespesa(req: Request, res: Response) {
        try {
            const { idUsuario } = req.body;

            await this.usuarioExiste(idUsuario);

            const despesa = await despesaService.cadastrarDespesa(req.body);

            res.status(201).json(despesa);
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

    async recuperarDespesasAll(req: Request, res: Response) {
        try {
            const { idUsuario } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);

            await this.usuarioExiste(idUsuarioVerificado);

            const categoriaEnum = validaCategoria.parse(req.query.categoria);

            const despesas = await despesaService.recuperarDespesasAll(
                idUsuarioVerificado,
                categoriaEnum,
            );

            res.status(200).json(despesas);
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

   async recuperarDespesasPorPeriodoECategoria(req: Request, res: Response) {
        try {
        const { idUsuario, periodo } = req.params;
        const { categoria } = req.query;

        const idUsuarioVerificado = idSchema.parse(idUsuario);

        await this.usuarioExiste(idUsuarioVerificado);

        const periodoValidado = periodoSchema.parse(periodo);

        const categoriaEnum = validaCategoria.parse(categoria);

        const despesas =
        await despesaService.recuperarDespesasPorPeriodoECategoria(
            idUsuarioVerificado,
            periodoValidado,
            categoriaEnum
        );

        return res.status(200).json(despesas);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json({ erro: error.message });
        }

        return res.status(500).json({
            erro: 'Erro interno no servidor',
            });
        }
    }

    async recuperarDespesa(req: Request, res: Response) {
        try {
            const { idUsuario, idDespesa } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idDespesaVerificado = idSchema.parse(idDespesa);

            await this.usuarioExiste(idUsuarioVerificado);

            const despesa = await despesaService.recuperarDespesa(
                idUsuarioVerificado,
                idDespesaVerificado,
            );

            res.status(200).json(despesa);
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

    async recuperarSomaGastosPorCategoria(req: Request, res: Response) {
        try {
            const { idUsuario, periodo } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);

            await this.usuarioExiste(idUsuarioVerificado);

            const periodoValidado = periodoSchema.parse(periodo);

            const despesas =
                await despesaService.recuperarSomaGastosPorCategoria(
                    idUsuarioVerificado,
                    periodoValidado,
                );

            res.status(200).json(despesas);
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

    async atualizarDespesa(req: Request, res: Response) {
        try {
            const { idUsuario, idDespesa } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idDespesaVerificado = idSchema.parse(idDespesa);

            await this.usuarioExiste(idUsuarioVerificado);

            const despesa = await despesaService.atualizaDespesa(
                idUsuarioVerificado,
                idDespesaVerificado,
                req.body,
            );

            res.status(200).json(despesa);
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

    async deletarDespesa(req: Request, res: Response) {
        try {
            const { idUsuario, idDespesa } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idDespesaVerificado = idSchema.parse(idDespesa);

            await this.usuarioExiste(idUsuarioVerificado);

            const despesa = await despesaService.deletarDespesa(
                idUsuarioVerificado,
                idDespesaVerificado,
            );

            res.status(200).json(despesa);
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
