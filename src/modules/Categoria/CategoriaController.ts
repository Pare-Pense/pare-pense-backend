import type { Request, Response } from 'express';
import { categoriaService } from './CategoriaService.js';
import { usuarioService } from '../Usuario/UsuarioService.js';
import { idSchema } from '../Schema.js';

export class CategoriaController {
    private async usuarioExiste(id: string) {
        await usuarioService.recuperaUsuario(id);
    }

    private trataErro(error: unknown, res: Response) {
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

    async listarCategorias(req: Request, res: Response) {
        try {
            const idUsuarioVerificado = idSchema.parse(req.params.idUsuario);

            await this.usuarioExiste(idUsuarioVerificado);

            const categorias =
                await categoriaService.listarCategorias(idUsuarioVerificado);

            res.status(200).json(categorias);
        } catch (error: unknown) {
            this.trataErro(error, res);
        }
    }

    async cadastrarCategoria(req: Request, res: Response) {
        try {
            await this.usuarioExiste(req.body.idUsuario);

            const categoria = await categoriaService.cadastrarCategoria(
                req.body,
            );

            res.status(201).json(categoria);
        } catch (error: unknown) {
            this.trataErro(error, res);
        }
    }

    async atualizarCategoria(req: Request, res: Response) {
        try {
            const { idUsuario, idCategoria } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idCategoriaVerificado = idSchema.parse(idCategoria);

            await this.usuarioExiste(idUsuarioVerificado);

            const categoria = await categoriaService.atualizarCategoria(
                idUsuarioVerificado,
                idCategoriaVerificado,
                req.body,
            );

            res.status(200).json(categoria);
        } catch (error: unknown) {
            this.trataErro(error, res);
        }
    }

    async deletarCategoria(req: Request, res: Response) {
        try {
            const { idUsuario, idCategoria } = req.params;

            const idUsuarioVerificado = idSchema.parse(idUsuario);
            const idCategoriaVerificado = idSchema.parse(idCategoria);

            await this.usuarioExiste(idUsuarioVerificado);

            const mensagem = await categoriaService.deletarCategoria(
                idUsuarioVerificado,
                idCategoriaVerificado,
            );

            res.status(200).json(mensagem);
        } catch (error: unknown) {
            this.trataErro(error, res);
        }
    }
}
