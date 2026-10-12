import { Router, type Request, type Response } from 'express';
import { CategoriaController } from './CategoriaController.js';
import {
    atualizarCategoriaSchema,
    criarCategoriaSchema,
} from './CategoriaSchema.js';
import { validarSchema } from '../../middlewares/validarSchema.js';
import { validarAuth } from '../../middlewares/validarAuth.js';

const routes: Router = Router();
const categoriaController = new CategoriaController();

routes.get(
    '/:idUsuario',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        categoriaController.listarCategorias(req, res),
);

routes.post(
    '/cadastrarCategoria',
    validarSchema(criarCategoriaSchema),
    validarAuth((req) => req.body.idUsuario),
    (req: Request, res: Response) =>
        categoriaController.cadastrarCategoria(req, res),
);

routes.patch(
    '/:idUsuario/:idCategoria',
    validarSchema(atualizarCategoriaSchema),
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        categoriaController.atualizarCategoria(req, res),
);

routes.delete(
    '/:idUsuario/:idCategoria',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        categoriaController.deletarCategoria(req, res),
);

export const categoriaRoutes = routes;
