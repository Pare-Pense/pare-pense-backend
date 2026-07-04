import { Router, type Request, type Response } from 'express';
import { ReceitaController } from './ReceitaController.js';
import { validarSchema } from '../../middlewares/validarSchema.js';
import { atualizarReceitaSchema, criarReceitaSchema } from './ReceitaSchema.js';
import { validarAuth } from '../../middlewares/validarAuth.js';

const routes: Router = Router();
const receitaController = new ReceitaController();

routes.get(
    '/:idUsuario',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        receitaController.recuperarReceitasAll(req, res),
);

routes.get(
    '/:idUsuario/:idReceita',
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        receitaController.recuperarReceita(req, res),
);

routes.post(
    '/cadastrarReceita',
    validarSchema(criarReceitaSchema),
    validarAuth((req) => req.body.idUsuario),
    (req: Request, res: Response) =>
        receitaController.cadastrarReceita(req, res),
);

routes.patch(
    '/:idUsuario/:idReceita',
    validarSchema(atualizarReceitaSchema),
    validarAuth('idUsuario'),
    (req: Request, res: Response) =>
        receitaController.atualizarReceita(req, res),
);

routes.delete(
    '/:idUsuario/:idReceita',
    validarAuth('idUsuario'),
    (req: Request, res: Response) => receitaController.deletarReceita(req, res),
);

export const receitaRoutes = routes;
