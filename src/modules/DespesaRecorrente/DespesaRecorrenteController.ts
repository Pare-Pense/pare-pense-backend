import type { Request, Response } from 'express';
import { despesaRecorrenteService } from './DespesaRecorrenteService.js';
import { usuarioService } from '../Usuario/UsuarioService.js';
import { idSchema } from '../Schema.js';

export class DespesaRecorrenteController {
    private async usuarioExiste(id: string) {
        await usuarioService.recuperaUsuario(id);
    }

    private trataErro(error: unknown, res: Response) {
        if (error instanceof Error) {
            if (error.message === 'Usuário não encontrado') {
                res.status(404).json({ erro: error.message });
                return;
            }

            if (error.message === 'Despesa recorrente não existe') {
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

    async listarDespesasRecorrentes(req: Request, res: Response) {
        try {
            const idUsuarioVerificado = idSchema.parse(req.params.idUsuario);

            await this.usuarioExiste(idUsuarioVerificado);

            const recorrentes =
                await despesaRecorrenteService.listarDespesasRecorrentes(
                    idUsuarioVerificado,
                );

            res.status(200).json(recorrentes);
        } catch (error: unknown) {
            this.trataErro(error, res);
        }
    }

    async cadastrarDespesaRecorrente(req: Request, res: Response) {
        try {
            await this.usuarioExiste(req.body.idUsuario);

            const recorrente =
                await despesaRecorrenteService.cadastrarDespesaRecorrente(
                    req.body,
                );

            res.status(201).json(recorrente);
        } catch (error: unknown) {
            this.trataErro(error, res);
        }
    }

    async atualizarDespesaRecorrente(req: Request, res: Response) {
        try {
            const { idUsuario, idDespesaRecorrente } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idVerificado = idSchema.parse(idDespesaRecorrente);

            await this.usuarioExiste(idUsuarioVerificado);

            const recorrente =
                await despesaRecorrenteService.atualizarDespesaRecorrente(
                    idUsuarioVerificado,
                    idVerificado,
                    req.body,
                );

            res.status(200).json(recorrente);
        } catch (error: unknown) {
            this.trataErro(error, res);
        }
    }

    async pausarDespesaRecorrente(req: Request, res: Response) {
        try {
            const { idUsuario, idDespesaRecorrente } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idVerificado = idSchema.parse(idDespesaRecorrente);

            await this.usuarioExiste(idUsuarioVerificado);

            const recorrente =
                await despesaRecorrenteService.pausarDespesaRecorrente(
                    idUsuarioVerificado,
                    idVerificado,
                );

            res.status(200).json(recorrente);
        } catch (error: unknown) {
            this.trataErro(error, res);
        }
    }

    async reativarDespesaRecorrente(req: Request, res: Response) {
        try {
            const { idUsuario, idDespesaRecorrente } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idVerificado = idSchema.parse(idDespesaRecorrente);

            await this.usuarioExiste(idUsuarioVerificado);

            const recorrente =
                await despesaRecorrenteService.reativarDespesaRecorrente(
                    idUsuarioVerificado,
                    idVerificado,
                );

            res.status(200).json(recorrente);
        } catch (error: unknown) {
            this.trataErro(error, res);
        }
    }

    async deletarDespesaRecorrente(req: Request, res: Response) {
        try {
            const { idUsuario, idDespesaRecorrente } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idVerificado = idSchema.parse(idDespesaRecorrente);

            await this.usuarioExiste(idUsuarioVerificado);

            const mensagem =
                await despesaRecorrenteService.deletarDespesaRecorrente(
                    idUsuarioVerificado,
                    idVerificado,
                );

            res.status(200).json(mensagem);
        } catch (error: unknown) {
            this.trataErro(error, res);
        }
    }
}
